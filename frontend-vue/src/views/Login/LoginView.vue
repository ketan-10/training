<script setup lang="ts">
import Logo from '@/assets/logo.svg'
import { Button } from '@/components/ui/button'

import { useForm } from 'vee-validate'

import { toTypedSchema } from '@vee-validate/zod'

import * as z from 'zod'
import { FormField } from '@/components/ui/form'
import FormItem from '@/components/ui/form/FormItem.vue'
import FormLabel from '@/components/ui/form/FormLabel.vue'
import FormControl from '@/components/ui/form/FormControl.vue'
import Input from '@/components/ui/input/Input.vue'
import FormMessage from '@/components/ui/form/FormMessage.vue'
import { useMutation } from '@tanstack/vue-query'
import request from '@/lib/axios.config'
import { useStorage } from '@vueuse/core'
import { Loader } from 'lucide-vue-next'
import { watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router'

const { setAuth } = useAuthStore()

const formSchemaImpl = z.object({
  userId: z.string(),
  password: z.string().min(1).max(20)
})

const formSchema = toTypedSchema(formSchemaImpl)

type FormType = z.infer<typeof formSchemaImpl>

const { handleSubmit, setFieldError } = useForm({
  initialValues: {
    userId: 'ketan',
    password: 'ketan'
  },
  validationSchema: formSchema
})

const { isPending, isError, error, isSuccess, mutate } = useMutation({
  mutationFn: (data: FormType) => request.post(`/auth/login`, data),
  onSuccess: (response) => {
    console.log(response.data)
    setAuth(response.data)
    router.push({ path: '/' })
  },
  onError: (err) => {
    setFieldError('password', 'eveybodycanlogin')
  }
})

const onSubmit = handleSubmit(async (values) => {
  // await mutate(values)

  if (values.userId !== 'ketan' || values.password !== 'ketan') {
    console.log('submitted: ', values)
    setFieldError('password', "don't touch the default userId or passwords 😂")
    return
  }
  setAuth({
    token:
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrZXRhbiIsImlhdCI6MjAxMjc3NTI3NCwiZXhwIjoyMDEyODExMjc0fQ.46yg6MgV7L_2thcYsUCT84wDMYM8BqJNnJMLIMCx5Jk',
    userDto: {
      userId: 'ketan',
      userName: 'Ketan Chaudhari'
    }
  })
  router.push({ path: '/' })
})
</script>

<template>
  <div class="flex min-h-screen">
    <div class="min-h-full flex-grow-[3] w-0 flex justify-center p-3">
      <div class="h-10 absolute top-5 left-5">
        <img class="object-contain h-full" src="@/assets/logo.svg" />
      </div>
      <div class="flex flex-col justify-center items-center min-w-full">
        <div id="application-title" class="mb-4 text-3xl font-extrabold text-center">
          Training Portal
        </div>
        <form class="space-y-8 max-w-sm w-full" @submit="onSubmit">
          <FormField name="userId" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>UserId</FormLabel>
              <FormControl>
                <Input placeholder="userId" type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="password" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password  " type="password" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" class="w-full" :disabled="isPending">
            <template v-if="!isPending"> Login </template>
            <div v-else className="p-2 rounded-full">
              <Loader className="w-5 h-5" />
            </div>
          </Button>
        </form>
      </div>
    </div>
    <div class="bg-blue-50 min-h-full flex-grow-[2] w-0 p-10 hidden md:flex md:justify-center">
      <img class="w-full h-full object-contain max-w-sm" src="@/assets/logo.svg" />
    </div>
  </div>
</template>
