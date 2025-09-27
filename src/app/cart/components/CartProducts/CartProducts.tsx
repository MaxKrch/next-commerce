import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import type React from 'react';

import InStockActionSlot from '../slots/InStockActionSlot';

import style from './CartProducts.module.scss';
import { useRootStore } from '@providers/RootStoreContext';
import Card from '@components/Card';
import Text from '@components/Text';

const InStockProducts: React.FC = () => {
  const { cartStore } = useRootStore();
  if (cartStore.inStockProducts.length === 0) {
    return null;
  }

  return (
    <section className={clsx(style['instok'])}>
      {cartStore.inStockProducts.length > 0 && (
        <ul className={clsx(style['instok__list'])}>
          {cartStore.inStockProducts.map((item) => (
            <li key={item.product.id}>
              <Card
                className={clsx(style['instock__card'])}
                product={item.product}
                display="cart"
                PriceSlot={() => (
                  <div className={clsx(style['content-slot'])}>
                    <Text className={clsx(style['content-slot__title'])}>Цена:</Text>
                    <Text className={clsx(style['content-slot__value'])}>${item.product.price}</Text>
                  </div>
                )}
                ActionSlot={() => <InStockActionSlot product={item.product} />}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default observer(InStockProducts);

// import clsx from 'clsx';
// import Card from 'components/Card';
// import Text from 'components/Text';
// import useRootStore from 'context/root-store/useRootStore';
// import { observer } from 'mobx-react-lite';
// import type React from 'react';

// import OutOfStockActionSlot from '../slots/OutOfStockActionSlot';

// import style from './OutOfStockProducts.module.scss';

// const OutOfStock: React.FC = () => {
//   const { cartStore } = useRootStore();

//   if (cartStore.outOfStockProducts.length === 0) {
//     return null;
//   }

//   return (
//     <section className={clsx(style['container'])}>
//       {cartStore.outOfStockProducts.length > 0 && (
//         <>
//           <Text tag="h2" className={clsx(style['title'])}>
//             Товаров пока нет:
//           </Text>
//           <ul className={clsx(style['list'])}>
//             {cartStore.outOfStockProducts.map((item) => (
//               <li key={item.product.id}>
//                 <Card
//                   className={clsx(style['card'])}
//                   product={item.product}
//                   display="cart"
//                   ActionSlot={() => <OutOfStockActionSlot product={item.product} />}
//                 />
//               </li>
//             ))}
//           </ul>
//         </>
//       )}
//     </section>
//   );
// };

// export default observer(OutOfStock);

