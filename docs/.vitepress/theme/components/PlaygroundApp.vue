<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useChat } from '@ai-chat-ui/core'
import { createChatMockProvider } from '@ai-chat-ui/adapters'
import TopBar from './TopBar.vue'
import Sidebar from './Sidebar.vue'
import ChatWindow from './ChatWindow.vue'
import {
  listConversations,
  getConversation,
  saveConversation,
  removeConversation,
  newId,
  titleFrom,
  cloneMessages,
  type StoredConversation,
} from './conversation-store'

const provider = createChatMockProvider()
const { messages, streaming, send, stop } = useChat({ provider })

const conversations = ref<StoredConversation[]>(listConversations())
const activeId = ref<string>(conversations.value[0]?.id ?? '')
const sidebarCollapsed = ref(false)

// 初始若有历史会话，则载入其消息
if (activeId.value) {
  const conv = getConversation(activeId.value)
  if (conv) messages.value = cloneMessages(conv.messages)
}

// 消息变化时持久化到当前会话，并刷新侧栏
watch(
  messages,
  (list) => {
    if (!activeId.value) return
    saveConversation({
      id: activeId.value,
      title: titleFrom(list),
      createdAt: Date.now(),
      messages: cloneMessages(list),
    })
    conversations.value = listConversations()
  },
  { deep: true },
)

const currentTitle = computed(() => {
  if (!activeId.value) return 'AI Chat UI'
  return conversations.value.find((c) => c.id === activeId.value)?.title ?? 'AI Chat UI'
})

function newChat() {
  stop()
  activeId.value = ''
  messages.value = []
  conversations.value = listConversations()
}

function selectConversation(id: string) {
  stop()
  activeId.value = id
  const conv = getConversation(id)
  messages.value = conv ? cloneMessages(conv.messages) : []
}

function removeConversation(id: string) {
  removeConversation(id)
  if (activeId.value === id) {
    stop()
    activeId.value = ''
    messages.value = []
  }
  conversations.value = listConversations()
}

function handleSend(text: string) {
  if (!activeId.value) activeId.value = newId()
  send(text)
}
</script>

<template>
  <div class="fixed inset-0 flex flex-col overflow-hidden bg-white text-slate-900">
    <TopBar
      :collapsed="sidebarCollapsed"
      :title="currentTitle"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
    />
    <div class="flex flex-1 overflow-hidden">
      <Sidebar
        v-if="!sidebarCollapsed"
        :conversations="conversations"
        :active-id="activeId"
        @new-chat="newChat"
        @select="selectConversation"
        @remove="removeConversation"
      />
      <ChatWindow :messages="messages" :streaming="streaming" @send="handleSend" @stop="stop" />
    </div>
  </div>
</template>
