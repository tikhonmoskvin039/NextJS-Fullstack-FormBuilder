'use server';

import { currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { formSchema, formSchemaType } from '@/schemas/form';
import { Form } from '@prisma/client';

class UserNotFoundError extends Error {}

export const GetFormStats = async () => {
  const user = await currentUser();

  if (!user) {
    throw new UserNotFoundError();
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
};

export const CreateForm = async (data: formSchemaType) => {
  const validation = formSchema.safeParse(data);

  if (!validation.success) {
    throw new Error('form not valid');
  }

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  const { name, description } = data;

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  });

  if (!form) {
    throw new Error('something went wrong');
  }

  return form.id;
};

export const GetForms = async () => {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  return await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const GetFormById = async (id: number): Promise<Form | null> => {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });
};

export const UpdateFormContent = async (
  id: number,
  jsonContent: string
): Promise<Form | null> => {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  return await prisma.form.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      content: jsonContent,
    },
  });
};

export const PublishForm = async (id: number): Promise<Form | null> => {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  return await prisma.form.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      published: true,
    },
  });
};

export const GetFormContentByUrl = async (shareURL: string) => {
  return await prisma.form.update({
    select: {
      content: true,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      shareURL,
      published: true,
    },
  });
};

export const SubmitForm = async (shareURL: string, content: string) => {
  return await prisma.form.update({
    select: {
      content: true,
    },
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmissions: {
        create: {
          content,
        },
      },
    },
    where: {
      shareURL,
    },
  });
};

export const GetFormWithSubmissions = async (id: number) => {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
    include: {
      FormSubmissions: true,
    },
  });
};

export const RemoveForm = async (id: number) => {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  // Удаляем сначала все связанные записи в FormSubmissions
  await prisma.formSubmissions.deleteMany({
    where: {
      formId: id,
    },
  });

  // Теперь можно удалить саму форму
  return await prisma.form.delete({
    where: {
      id,
    },
  });
};

export const ChangeFormName = async (form: Form, formName: string) => {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  const { id, name } = form;

  return await prisma.form.update({
    select: {
      content: true,
    },
    data: {
      name: formName,
    },
    where: {
      id,
    },
  });
};
