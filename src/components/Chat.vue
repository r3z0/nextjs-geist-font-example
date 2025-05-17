<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '~/lib/supabaseClient'

const props = defineProps({
  gameId: {
    type: [String, Number],
    required: true
  }
})

const messages = ref([])
const newMessage = ref('')
const errorMsg = ref('')
const loading = ref(true)
const user = ref(null)

let chatSubscription = null

const fetchUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    errorMsg.value = error.message
  } else {
    user.value = data.user
  }
}

const fetchMessages = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('chat')
    .select('*')
    .eq('game_id', props.gameId)
    .order('created_at', { ascending: true })
  if (error) {
    errorMsg.value = error.message
  } else {
    messages.value = data
  }
  loading.value = false
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  if (!user.value) {
    errorMsg.value = 'You must be logged in to send messages.'
    return
  }
  const message = newMessage.value.trim()
  newMessage.value = ''
  const { error } = await supabase.from('chat').insert([{ game_id: props.gameId, user_id: user.value.id, content: message }])
  if (error) {
    errorMsg.value = error.message
  }
}

const subscribeToChat = () => {
  chatSubscription = supabase
    .channel('public:chat')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat', filter: `game_id=eq.${props.gameId}` }, payload => {
      messages.value.push(payload.new)
    })
    .subscribe()
}

onMounted(async () => {
  await fetchUser()
  await fetchMessages()
  subscribeToChat()
})

onUnmounted(() => {
  if (chatSubscription) supabase.removeChannel(chatSubscription)
})
</script>

<template>
  <div class="border rounded p-4 h-[600px] flex flex-col">
    <h2 class="text-xl font-semibold mb-4">Chat</h2>
    <div class="flex-1 overflow-y-auto mb-4 space-y-2">
      <div v-if="loading" class="text-center">Loading messages...</div>
      <div v-else>
        <div v-for="msg in messages" :key="msg.id" class="p-2 rounded bg-gray-100">
          <strong>{{ msg.user_id }}</strong>: {{ msg.content }}
        </div>
      </div>
    </div>
    <div>
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type your message..."
        class="w-full border rounded px-3 py-2 mb-2"
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage" class="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
        Send
      </button>
      <div v-if="errorMsg" class="text-red-600 font-semibold mt-2">{{ errorMsg }}</div>
    </div>
  </div>
</template>
