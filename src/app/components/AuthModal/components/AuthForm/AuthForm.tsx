import React, { memo, useEffect } from "react";
import { schema, Schema } from "../../AuthModal.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRootStore } from "@providers/RootStoreContext";
import style from './AuthForm.module.scss'
import clsx from "clsx";
import Text from "@components/Text";
import Input from "@components/Input";
import CheckBox from "@components/CheckBox";
import Button from "@components/Button";
import { AUTH_MODES, AuthModes } from "../../constants";
import { META_STATUS, MetaStatus } from "@constants/meta-status";

export type AuthFormProps = {
    onSubmit: (data: Schema) => void,
    mode: AuthModes, 
    needReset: boolean,
    error?: string | null,
    status?: MetaStatus
}

const AuthForm: React.FC<AuthFormProps> = ({ 
    onSubmit, 
    mode, 
    needReset, 
    error, 
    status 
}) => {
    const {
        register,
        control,
        formState: { errors, isValid, isDirty },
        handleSubmit,
        reset
    } = useForm<Schema>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })

    useEffect(() => {
        if(needReset) {
            reset({
                login: '',
                email: '',
                password: '',
                saveMe: true,
            })
        }
    }, [needReset])

    return(
        <form onSubmit={handleSubmit(onSubmit)} className={clsx(style['form'])}>
            <label className={clsx(style['form__label'])}>
                <Text weight="bold" className={clsx(style['form__description'])}>
                    Логин:
                </Text>
                <Input
                    className={clsx(style['form__input'])}
                    {...register('login')}
                />
                <div className={clsx(style['form__error'])}>
                    {errors.login && errors.login.message}
                </div>
            </label>
            
            {mode === AUTH_MODES.REGISTER &&
                <label className={clsx(style['form__label'])}>
                    <Text weight="bold" className={clsx(style['form__description'])}>
                        Email:
                    </Text>
                    <Input 
                        className={clsx(style['form__input'])}
                        type='email'
                        {...register('email')}
                    />
                    <div className={clsx(style['form__error'])}>
                        {errors.email && errors.email.message}
                    </div>                        
                </label>
            }
            
            <label className={clsx(style['form__label'])}>
                <Text weight="bold" className={clsx(style['form__description'])}>
                    Пароль:
                </Text>
                <Input 
                    className={clsx(style['form__input'])}
                    type='password'
                    {...register('password')}
                />
                <div className={clsx(style['form__error'])}>
                    {errors.password && errors.password.message}
                </div>
            </label>
            
            <label className={clsx(style['form-checkbox'])}>
                <Text weight="bold" className={clsx(style['form__description'])}>
                    Запомнить меня:
                </Text>
                <Controller
                    name="saveMe"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <CheckBox
                            checked={field.value}
                            onChange={field.onChange}
                            ref={field.ref}
                            className={clsx(style['form-checkbox__check'])}
                        />
                    )}
                />
            </label> 
            <div className={clsx(style['form__error'])}>
                {error}
            </div>
            <Button
                type='submit'
                className={clsx(style['form__submit'])} 
                disabled={!isValid || !isDirty}
                loading={status === META_STATUS.PENDING}
            >
                {mode === AUTH_MODES.LOGIN ? 'Войти' : 'Зарегистрироваться'}
            </Button>
        </form>
    )
}

export default memo(AuthForm);