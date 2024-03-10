'use server'

import { currentUser } from '@clerk/nextjs'
import prisma from '@/lib/prisma'
import { formSchema, formSchemaType } from '@/schemas/form'
import { Form } from '@prisma/client'

class UserNotFoundError extends Error {}

export const GetFormStats = async () => {
  const user = await currentUser()

  if (!user) {
    throw new UserNotFoundError()
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id
    },
    _sum: {
      visits: true,
      submissions: true
    }
  })

  const visits = stats._sum.visits || 0
  const submissions = stats._sum.submissions || 0

  let submissionRate = 0

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100
  }

  const bounceRate = 100 - submissionRate

  return {
    visits, submissions, submissionRate, bounceRate
  }
}

export const CreateForm = async (data: formSchemaType) => {
  const validation = formSchema.safeParse(data)

  if (!validation.success) {
    throw new Error('form not valid')
  }

  const user = await currentUser()
  if (!user) {
    throw new UserNotFoundError()
  }

  const { name, description } = data

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name,
      description
    }
  })

  if (!form) {
    throw new Error('something went wrong')
  }

  return form.id
}

export const GetForms = async () => {
  const user = await currentUser()
  if (!user) {
    throw new UserNotFoundError()
  }

  return await prisma.form.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const GetFormById = async (id: number): Promise<Form | null> => {
  const user = await currentUser()
  if (!user) {
    throw new UserNotFoundError()
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id
    }
  })
}
