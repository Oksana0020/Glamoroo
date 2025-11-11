import React from "react";
import { useTranslation } from "@/contexts/TranslationContext";

const ContactBreadcrumb = () => {
  const { t } = useTranslation();
  
  return (
    <section className="breadcrumb__area include-bg text-center pt-95 pb-50">
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div className="breadcrumb__content p-relative z-index-1">
              <h3 className="breadcrumb__title">{t('contact.title')}</h3>
              <div className="breadcrumb__list">
                <span>
                  <a href="#">{t('nav.home')}</a>
                </span>
                <span>{t('nav.contact')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactBreadcrumb;
