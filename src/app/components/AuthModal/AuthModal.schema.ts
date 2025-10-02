import z from "zod";

const schema = z.object({
    login: z.string().min(3, 'Логин должен быть длиннее 2 символов'),
    email: z.email('Некорректный email').optional(),
    password: z.string().regex(/^(?=.*[a-zA-Z])(?=.*\d).{5,}$/, { message: 'используйте минимум 5 цифр и латинских букв' }),
    saveMe: z.boolean()
})

type Schema = z.infer<typeof schema>

export {
    schema,
    type Schema
}
