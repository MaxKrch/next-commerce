import z, { nullable } from "zod";

export const schema = z.object({
    login: z.string().min(3, 'Логин должен быть не менее 3 символов'),
    email: z.email('Некорректный email').optional(),
    password: z.string().min(3, 'Пароль должен быть не менее 5 символов')
        .regex(/^(?=.*[a-zA-Z])(?=.*\d).{5,}$/, { message: 'Используйте только цифры и латинские буквы' }),
    saveMe: z.boolean()
})

export type Schema = z.infer<typeof schema>

