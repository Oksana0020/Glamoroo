import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
// internal
import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useTranslation } from "@/contexts/TranslationContext";

// schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  subject: Yup.string().required().label("Subject"),
  message: Yup.string().required().label("Subject"),
  remember: Yup.bool()
    .oneOf([true], "You must agree to the terms and conditions to proceed.")
    .label("Terms and Conditions"),
});

const ContactForm = () => {
    const { t } = useTranslation();

    // react hook form
    const {register,handleSubmit,formState: { errors },reset} = useForm({
      resolver: yupResolver(schema),
    });
    // on submit
    const onSubmit = (data) => {
      if(data){
        notifySuccess(t('contact.messageSent'));
      }

      reset();
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="contact-form">
      <div className="tp-contact-input-wrapper">
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("name", { required: `Name is required!` })} name="name" id="name" type="text" placeholder="Shahnewaz Sakil" />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="name">{t('contact.yourName')}</label>
          </div>
          <ErrorMsg msg={errors.name?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("email", { required: `Email is required!` })} name="email" id="email" type="email" placeholder="shofy@mail.com" />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="email">{t('contact.yourEmail')}</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("subject", { required: `Subject is required!` })} name="subject" id="subject" type="text" placeholder={t('contact.writeSubject')} />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="subject">{t('contact.subject')}</label>
          </div>
          <ErrorMsg msg={errors.subject?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <textarea {...register("message", { required: `Message is required!` })} id="message" name="message" placeholder={t('contact.writeMessage')}/>
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="message">{t('contact.yourMessage')}</label>
          </div>
          <ErrorMsg msg={errors.message?.message} />
        </div>
      </div>
      <div className="tp-contact-suggetions mb-20">
        <div className="tp-contact-remeber">
          <input  {...register("remember", {required: `Terms and Conditions is required!`})} name="remember" id="remember" type="checkbox" />
          <label htmlFor="remember">{t('contact.saveInfo')}</label>
          <ErrorMsg msg={errors.remember?.message} />
        </div>
      </div>
      <div className="tp-contact-btn">
        <button type="submit">{t('contact.sendMessageBtn')}</button>
      </div>
    </form>
  );
};

export default ContactForm;