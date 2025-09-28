import clsx from 'clsx';
import style from '../../Cart.module.scss';
import { ProductType } from '@model/products';
import { useRootStore } from '@providers/RootStoreContext';
import Button from '@components/Button';
import { observer } from 'mobx-react-lite';

const ClearActionSlot: React.FC<{ product: ProductType }> = ({ product }) => {
  const { cartStore } = useRootStore();

  return (
    <div className={clsx(style['action-slot'])}>
      <Button priority="secondary" className={clsx('action-slot__button')} onClick={() => cartStore.removeAllProductItems(product)}>
        Удалить все
      </Button>
    </div>
  );
};

export default observer(ClearActionSlot);
