import { checkSchema } from 'express-validator'

export const signUp = checkSchema({
    name: {
        trim: true,
        isLength: {
            options: { min: 2}
        },
        errorMessage: 'Nome precisa ter pelo menos 2 caracteres'
    },
    email: {
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'Digite um e-mail valido'
    },
    password: {
        isLength: {
            options: { min: 2}
        },
        errorMessage: 'Senha precisa ter pelo menos 2 caracteres'
    },
    state: {
        notEmpty: true,
        errorMessage: 'Estado não preenchido'
    }
})