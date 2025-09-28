import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import style from '../../Cart.module.scss';
import { ProductType } from '@model/products';
import { useRootStore } from '@providers/RootStoreContext';
import ClearActionSlot from './ClearActionSlot';
import DefaultCardActionSlot from '@components/Card/slots/DefaultCardActionSlot';

const InStockActionSlot: React.FC<{ product: ProductType }> = ({ product }) => {
  const { cartStore } = useRootStore();

  return (
    <div className={clsx(style['action-slot'])}>
      <ClearActionSlot product={product} />
      <DefaultCardActionSlot product={product}/>
    </div>
  );
};

export default observer(InStockActionSlot);
