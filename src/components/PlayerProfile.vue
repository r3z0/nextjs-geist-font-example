<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '~/lib/supabaseClient'
import { useRouter } from 'vue-router'

const user = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const router = useRouter()

const fetchUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    errorMsg.value = error.message
  } else {
    user.value = data.user
  }
  loading.value = false
}

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

onMounted(() => {
  fetchUser()
})
</script>

<template>
  <div class="p-4 border rounded max-w-sm mx-auto">
    <div v-if="loading" class="text-center">Loading profile...</div>
    <div v-else>
      <div v-if="errorMsg" class="text-red-600 font-semibold">{{ errorMsg }}</div>
      <div v-else-if="user">
        <h2 class="text-xl font-bold mb-2">Player Profile</h2>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <button @click="logout" class="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
          Logout
        </button>
      </div>
      <div v-else>
        <p>No user logged in.</p>
      </div>
    </div>
  </div>
</template>
