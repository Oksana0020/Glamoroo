import React from "react";
import { useTranslation } from "@/contexts/TranslationContext";

const CommonBreadcrumb = ({
  title,
  subtitle,
  center = false,
  bg_clr = false,
}) => {
  const { t } = useTranslation();
  
  return (
    <section
      className={`breadcrumb__area ${
        center ? "text-center" : ""
      } include-bg pt-95 pb-50`}
      style={{ backgroundColor: bg_clr && `#EFF1F5` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div className="breadcrumb__content p-relative z-index-1">
              <h3 className="breadcrumb__title">{title}</h3>
              <div className="breadcrumb__list">
                <span>
                  <a href="#">{t('nav.home')}</a>
                </span>
                <span>{subtitle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommonBreadcrumb;
