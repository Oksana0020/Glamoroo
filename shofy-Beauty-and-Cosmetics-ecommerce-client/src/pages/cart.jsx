import React from 'react';
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import CartArea from '@/components/cart-wishlist/cart-area';
import CommonBreadcrumb from '@/components/breadcrumb/common-breadcrumb';
import { useTranslation } from '@/contexts/TranslationContext';

const CartPage = () => {
  const { t } = useTranslation();
  
  return (
    <Wrapper>
      <SEO pageTitle={t('nav.cart')} />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title={t('cart.title')} subtitle={t('cart.title')} />
      <CartArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default CartPage;