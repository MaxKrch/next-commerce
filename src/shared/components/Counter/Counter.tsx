import MinusIcon from '@components/icons/MinusIcon'
import style from './Counter.module.scss'
import PlusIcon from '@components/icons/PlusIcon'
import Text from '@components/Text'
import { memo } from 'react'
import clsx from 'clsx'

export type CounterProps = {
    count: number,
    className?: string,
    priority?: 'primary' | 'secondary',
    onInc: () => void,
    onDec: () => void,
}

const Counter: React.FC<CounterProps> = ({
    count,
    onInc,
    onDec,
    priority,
    className,
}) => {
    return(
        <div className={clsx(style['counter'], className)}>
            <div className={clsx(style['counter__button'], style[`counter__button_${priority}`])}>
                <MinusIcon className={clsx(style['counter__icon'])} onClick={onDec}/>
            </div>
            <Text weight='bold' className={clsx(style['counter__count'])}>
                {count}
            </Text>
            <div className={clsx(style['counter__button'], style[`counter__button_${priority}`])}>
                <PlusIcon className={clsx(style['counter__icon'])} onClick={onInc}/>
            </div>
        </div>
    )
}

export default memo(Counter)

