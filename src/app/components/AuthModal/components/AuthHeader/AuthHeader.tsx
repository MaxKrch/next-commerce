import Button from "@components/Button";
import style from './AuthHeader.module.scss';
import clsx from "clsx";
import { memo, useCallback } from "react";
import { AUTH_MODES, AuthModes } from "../../constants";


export type AuthHeaderProps = {
    mode: AuthModes,
    onChange: (mode: AuthModes) => void
}

const AuthHeader: React.FC<AuthHeaderProps> = ({mode, onChange}) => {
    const handleChangeMode = useCallback((newMode: AuthModes) => {
        if(mode !== newMode) {
            onChange(newMode)
        }
    }, [mode])

    return( 
        <div className={clsx(style['header'])}>                    
            <Button 
                onClick={() => handleChangeMode(AUTH_MODES.LOGIN)}
                className={clsx(
                    style['header__button'], 
                    mode === AUTH_MODES.LOGIN && style['header__button_active']
                )}
                priority={mode === AUTH_MODES.LOGIN ? 'primary' : 'secondary'}
            >
                Вход
            </Button>
            <Button 
                onClick={() => handleChangeMode(AUTH_MODES.REGISTER)}
                className={clsx(
                    style['header__button'], 
                    mode === AUTH_MODES.REGISTER && style['header__button_active']
                )}
                priority={mode === AUTH_MODES.REGISTER ? 'primary' : 'secondary'}
            >
                Регистрация
            </Button>
        </div>  
    )
}

export default memo(AuthHeader);