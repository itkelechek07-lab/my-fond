/**
 * script.js — «Помощник СоцФонда» MVP+
 *
 * Хранение: LocalStorage (ключ socfond_mvp_applications).
 * Язык интерфейса: LocalStorage (ключ socfond_mvp_lang): ru | ky
 */

(function () {
  'use strict';

  var STORAGE_APPS = 'socfond_mvp_applications';
  var STORAGE_DEMO_QUEUE = 'socfond_mvp_demo_queue_seeded';
  var STORAGE_LANG = 'socfond_mvp_lang';
  var SESSION_USER = 'socfond_mvp_user';
  var SESSION_ADMIN = 'socfond_mvp_admin';

  var ADMIN_PASSWORD = 'admin';

  /** Подписи услуг по языкам */
  var SERVICE_BY_LANG = {
    ru: {
      pension: 'Пенсия',
      benefit: 'Пособие',
      certificate: 'Справка',
      consult: 'Консультация',
    },
    ky: {
      pension: 'Пенсия',
      benefit: 'Жөлөм',
      certificate: 'Маалымат',
      consult: 'Кеңеш',
    },
    en: {
      pension: 'Pension',
      benefit: 'Benefit',
      certificate: 'Certificate',
      consult: 'Consultation',
    },
  };

  var STATUS_BY_LANG = {
    ru: { accepted: 'Принято', processing: 'В обработке', done: 'Готово' },
    ky: { accepted: 'Кабыл алынды', processing: 'Иштетилүүдө', done: 'Даяр' },
    en: { accepted: 'Accepted', processing: 'Processing', done: 'Done' },
  };

  /** Допустимый интервал времени записи */
  var BOOKING_TIME_MIN = '08:30';
  var BOOKING_TIME_MAX = '17:00';
  var SESSION_PIN = 'socfond_mvp_pin';

  /** Ключи i18n для цели обращения по типу услуги */
  var BOOKING_SUBTYPE_KEYS = {
    pension: ['sub_pension_first', 'sub_pension_recalc', 'sub_pension_transfer'],
    benefit: ['sub_benefit_family', 'sub_benefit_child', 'sub_benefit_unemployment'],
    certificate: ['sub_cert_income', 'sub_cert_work', 'sub_cert_pension'],
    consult: ['sub_consult_general'],
  };

  var bookingWizardStep = 1;

  /**
   * Кабинет и ФИО специалиста по услуге (демо).
   * Модель заявки может содержать cabinet, staffName — подставляются при создании.
   */
  var BOOKING_STAFF = {
    ru: {
      pension: { cabinet: 'Кабинет № 12, 2-й этаж', staff: 'Асылбекова Майрам Асылбековна' },
      benefit: { cabinet: 'Окна № 5–6, 2-й этаж', staff: 'Асанов Бакыт Темирович' },
      certificate: { cabinet: 'Окно № 3, 1-й этаж', staff: 'Омурбекова Айгүл Аскаровна' },
      consult: { cabinet: 'Стойка информации, 1-й этаж', staff: 'Нурланов Тимур Эркинович' },
    },
    ky: {
      pension: { cabinet: '№ 12 кабинет, 2-башкы кабат', staff: 'Асылбекова Майрам Асылбековна' },
      benefit: { cabinet: '№ 5–6 терезелер, 2-башкы кабат', staff: 'Асанов Бакыт Темирович' },
      certificate: { cabinet: '№ 3 терезе, 1-башкы кабат', staff: 'Өмүрбекова Айгүл Аскаровна' },
      consult: { cabinet: 'Маалымат тактасы, 1-башкы кабат', staff: 'Нурланов Тимур Эркинович' },
    },
    en: {
      pension: { cabinet: 'Office 12, 2nd floor', staff: 'Asylbekova Mairam Asylbekovna' },
      benefit: { cabinet: 'Windows 5–6, 2nd floor', staff: 'Bakyt Temirovich Asanov' },
      certificate: { cabinet: 'Window 3, 1st floor', staff: 'Aigul Askarovna Omurbekova' },
      consult: { cabinet: 'Information desk, 1st floor', staff: 'Timur Erkinovich Nurlanov' },
    },
  };

  /** Мастер документов — полные тексты по языкам */
  var WIZARD_BY_LANG = {
    ru: {
      pension: {
        title: 'Документы для оформления пенсии',
        items: [
          'Паспорт',
          'ИНН / СНИЛС (при наличии)',
          'Сведения о трудовой деятельности',
          'Документы о стаже (при необходимости)',
        ],
        tips: ['Проверьте актуальность паспортных данных.', 'Возьмите копии документов.'],
      },
      benefit: {
        title: 'Документы для оформления пособия',
        itemsHeading: 'Основные документы',
        items: [
          'Паспорт (родителя или заявителя)',
          'Свидетельство о рождении ребёнка',
          'Справка о составе семьи',
          'Справка с места жительства',
          'Свидетельство о браке (если есть)',
          'Справка о доходах',
          'Банковский счёт или данные Элкарт',
          'СНИЛС / персональный идентификационный номер (ПИН)',
        ],
        sections: [
          {
            title: 'Если пособие «Семейная помощь» — дополнительно:',
            items: [
              'Акт о социальном статусе',
              'Сведения о земельном участке или имуществе',
              'Если не работает — трудовая книжка или справка о безработице',
            ],
          },
          {
            title: 'Если по инвалидности:',
            items: [
              'Заключение медико-социальной экспертизы (МСЭК)',
              'Справки о состоянии здоровья',
            ],
          },
        ],
        tips: [
          'Документы обычно подают в районное управление социального развития или через портал «Түндүк».',
          'Уточните вид пособия в Фонде.',
          'Подготовьте телефон для связи.',
        ],
      },
      certificate: {
        title: 'Документы для справки',
        items: ['Паспорт', 'ИНН / СНИЛС', 'Заявление по форме'],
        tips: ['Укажите, для кого справка.', 'Срок изготовления уточните у специалиста.'],
      },
    },
    ky: {
      pension: {
        title: 'Пенсияны тариздөө үчүн документтер',
        items: [
          'Паспорт',
          'ИНН / СНИЛС (бар болсо)',
          'Эмгек ишмердүүлүгү тууралуу маалымат',
          'Эмгек стажы тууралуу документтер (керек болсо)',
        ],
        tips: ['Паспорттук маалыматтарды текшериңиз.', 'Документтердин көчүрмөлөрүн алыңыз.'],
      },
      benefit: {
        title: 'Жөлөм үчүн керектүү документтер',
        itemsHeading: 'Негизги документтер',
        items: [
          'Паспорт (ата-эненин же кайрылуучунун)',
          'Баланын туулгандыгы тууралуу күбөлүгү',
          'Үй-бүлө курамы тууралуу маалымкат',
          'Жашаган жеринен маалымкат',
          'Нике күбөлүгү (эгер бар болсо)',
          'Киреше тууралуу маалымкат',
          'Банктык эсеп же Элкарт маалыматы',
          'СНИЛС / персоналдык идентификациялык номер (ПИН)',
        ],
        sections: [
          {
            title: 'Эгер «Үй-бүлөгө көмөк» жөлөк пулу болсо — кошумча:',
            items: [
              'Социалдык абал тууралуу акт',
              'Жер үлүшү же мүлк тууралуу маалымат',
              'Иштебеген болсо — эмгек китепчеси же жумушсуздук маалымкаты',
            ],
          },
          {
            title: 'Эгер майыптык боюнча болсо:',
            items: [
              'Медициналык комиссиянын (МСЭК) корутундусу',
              'Ден соолук тууралуу маалымкаттар',
            ],
          },
        ],
        tips: [
          'Документтерди адатта Аймактык социалдык өнүктүрүү башкармалыгына же Түндүк порталы аркылуу тапшырышат.',
          'Жөлөм түрүн Фонддо тактаңыз.',
          'Байланыш үчүн телефон даярдаңыз.',
        ],
      },
      certificate: {
        title: 'Маалымат үчүн документтер',
        items: ['Паспорт', 'ИНН / СНИЛС', 'Форма боюнча арыз'],
        tips: ['Ким үчүн экенин көрсөтүңүз.', 'Даярдык мөөнөтүн адистен сураңыз.'],
      },
    },
    en: {
      pension: {
        title: 'Documents for pension application',
        items: [
          'Passport',
          'Tax ID / social insurance number (if any)',
          'Employment records',
          'Proof of work history (if required)',
        ],
        tips: ['Check that passport details are up to date.', 'Bring copies of documents.'],
      },
      benefit: {
        title: 'Documents required for a benefit',
        itemsHeading: 'Main documents',
        items: [
          'Passport (parent or applicant)',
          'Child’s birth certificate',
          'Certificate of family composition',
          'Certificate of residence',
          'Marriage certificate (if applicable)',
          'Income certificate',
          'Bank account or Elcard details',
          'SNILS / personal identification number (PIN)',
        ],
        sections: [
          {
            title: 'If “Family support” benefit — additionally:',
            items: [
              'Certificate of social status',
              'Land plot or property information',
              'If not employed — work book or unemployment certificate',
            ],
          },
          {
            title: 'If disability-related:',
            items: [
              'Medical and social examination (MSE) conclusion',
              'Health certificates',
            ],
          },
        ],
        tips: [
          'Documents are usually submitted to the district social development office or via the Tunduk portal.',
          'Clarify the benefit type at the Fund.',
          'Have a phone number ready.',
        ],
      },
      certificate: {
        title: 'Documents for a certificate',
        items: ['Passport', 'Tax ID / social insurance number', 'Application form'],
        tips: ['State who the certificate is for.', 'Ask staff about processing time.'],
      },
    },
  };

  /** Системный промпт для будущего API — по языку интерфейса */
  var AI_SYSTEM_PROMPTS = {
    ru: 'Ты помощник по соцфонду Кыргызской Республики. Объясняй простым языком.',
    ky: 'Сен Кыргыз Республикасынын социалдык фонду боюнча жардамчысың. Жөнөкөй тил менен түшүндүр.',
    en: 'You are an assistant for the Social Fund of the Kyrgyz Republic. Explain in plain language.',
  };

  /**
   * Переводы UI (плоские ключи).
   * Плейсхолдеры: {id}, {excerpt}, {n}, {ahead}, {min}
   */
  var TRANSLATIONS = {
    ru: {
      page_title: 'Помощник СоцФонда',
      page_meta_description:
        'Помощник СоцФонда — онлайн-услуги социального фонда: заявки, запись, статус, документы, AI-консультант.',
      skip_link: 'Перейти к содержимому',
      logo_text: 'Помощник СоцФонда',
      nav_toggle_aria: 'Меню',
      nav_main_aria: 'Основная навигация',
      lang_switch_aria: 'Язык интерфейса',
      lang_ru_label: 'Русский',
      lang_ky_label: 'Кыргызча',
      nav_home: 'Главная',
      nav_cabinet: 'Личный кабинет',
      nav_booking: 'Запись',
      nav_status: 'Статус',
      nav_documents: 'Документы',
      nav_ai: 'AI-консультант',
      nav_queue: 'Очередь',
      nav_admin: 'Админ',
      hero_badge: 'MVP+ · Социальный фонд',
      hero_title: 'Услуги Социального фонда онлайн',
      hero_lead:
        'Проверьте заявку, запишитесь на приём, узнайте список документов или задайте вопрос AI-помощнику — в одном окне.',
      btn_check_status: 'Проверить статус заявки',
      btn_book: 'Записаться на приём',
      btn_docs: 'Узнать список документов',
      btn_ai_q: 'Задать вопрос (AI)',
      mini_cabinet_h: 'Личный кабинет',
      mini_cabinet_p: 'Вход по имени — ваши заявки и история.',
      mini_cabinet_btn: 'Открыть →',
      mini_queue_h: 'Электронная очередь',
      mini_queue_p: 'Все записи и очередь — в разделе «Статус».',
      mini_queue_btn: 'Перейти →',
      cabinet_h2: 'Личный кабинет',
      cabinet_desc:
        'Войдите по имени, чтобы видеть свои заявки. Регистрация не требуется — имя используется как «логин» на этом устройстве.',
      login_h3: 'Вход',
      login_name_lbl: 'Ваше имя',
      login_name_ph: 'Например: Айгуль Асанова',
      btn_enter: 'Войти',
      cabinet_greet_start: 'Здравствуйте,',
      cabinet_greet_end: '!',
      btn_logout: 'Выйти',
      my_applications_h3: 'Мои заявки',
      booking_title: 'Подать заявку',
      booking_desc:
        'Пошаговая подача заявления в Соцфонд КР: личные данные, услуга, дата приёма и подтверждение.',
      booking_steps_aria: 'Шаги подачи заявки',
      booking_step_personal: 'Данные',
      booking_step_service: 'Услуга',
      booking_step_visit: 'Приём',
      booking_step_confirm: 'Подтверждение',
      booking_btn_next: 'Далее',
      booking_btn_back: 'Назад',
      booking_review_title: 'Проверьте данные',
      booking_consent:
        'Подтверждаю достоверность данных и согласие на обработку персональных данных (учебный демо-режим).',
      booking_docs_title: 'Документы на приём',
      booking_docs_note: 'Отметьте документы, которые возьмёте с собой:',
      booking_docs_required: 'Отметьте все пункты списка документов.',
      booking_slot_free: 'Слот свободен — можно записаться.',
      booking_slot_busy: 'На это время уже есть запись. Выберите другое время.',
      booking_pin_invalid: 'ПИН должен содержать ровно 14 цифр.',
      booking_phone_invalid: 'Укажите номер телефона (не менее 9 цифр).',
      bf_pin: 'ПИН (14 цифр)',
      bf_pin_ph: '12345678901234',
      bf_phone: 'Телефон',
      bf_phone_ph: '+996 555 123 456',
      bf_email: 'Email (необязательно)',
      bf_email_ph: 'example@mail.kg',
      bf_subtype: 'Цель обращения',
      bf_office: 'Отделение Соцфонда',
      bf_comment: 'Комментарий (необязательно)',
      bf_comment_ph: 'Уточнение по заявлению',
      office_bishkek: 'Центральное отделение (Бишкек)',
      office_osh: 'Ошское отделение',
      office_jalal: 'Джалал-Абадское отделение',
      sub_pension_first: 'Первичное назначение пенсии',
      sub_pension_recalc: 'Перерасчёт пенсии',
      sub_pension_transfer: 'Перенос стажа / восстановление',
      sub_benefit_family: 'Пособие «Семейная помощь»',
      sub_benefit_child: 'Пособие по уходу за ребёнком',
      sub_benefit_unemployment: 'Пособие по безработице',
      sub_cert_income: 'Справка о доходах',
      sub_cert_work: 'Справка о трудовой деятельности',
      sub_cert_pension: 'Справка о размере пенсии',
      sub_consult_general: 'Общая консультация',
      booking_review_name: 'ФИО',
      booking_review_pin: 'ПИН',
      booking_review_phone: 'Телефон',
      booking_review_email: 'Email',
      booking_review_service: 'Услуга',
      booking_review_subtype: 'Цель',
      booking_review_office: 'Отделение',
      booking_review_datetime: 'Дата и время',
      booking_review_comment: 'Комментарий',
      booking_time_hint: 'Допустимое время: с 08:30 до 17:00 (шаг 5 минут).',
      booking_lbl_cabinet: 'Кабинет / окно:',
      booking_lbl_employee: 'Специалист:',
      booking_success_staff: 'Приём: {cabinet}. Специалист: {staff}.',
      bf_name: 'ФИО',
      bf_name_ph: 'ФИО полностью',
      bf_service: 'Услуга',
      bf_date: 'Дата',
      bf_time: 'Время',
      btn_submit_app: 'Отправить заявку',
      ph_select: '— Выберите —',
      svc_pension: 'Пенсия',
      svc_benefit: 'Пособие',
      svc_cert: 'Справка',
      svc_consult: 'Консультация',
      booking_success:
        'Заявка успешно создана! Ваш номер: {id}. Сохраните его для проверки статуса.',
      booking_modal_title: 'Заявка создана',
      booking_modal_btn: 'Понятно',
      status_title: 'Статус и электронная очередь',
      status_desc:
        'Ниже — полный список всех записавшихся (очередь по дате и времени приёма, демо). Чтобы посмотреть одну заявку, введите номер (формат SF-2026-1234 или коротко 4 цифры, напр. 1234).',
      status_all_queue_title: 'Все в очереди',
      status_all_queue_desc:
        'Каждая строка — заявка клиента: позиция, номер, имя, услуга, отделение, дата и время, место в очереди и статус.',
      status_queue_count: 'Всего в очереди: {n}',
      status_queue_empty: 'Записей пока нет. Оформите запись в разделе «Запись».',
      th_office: 'Отделение',
      th_position: '№',
      status_id_lbl: 'Номер заявки',
      status_id_ph: 'SF-2026-1234',
      btn_find: 'Найти',
      status_prompt: 'Введите номер заявки.',
      status_not_found: 'Заявка не найдена.',
      lbl_status: 'Статус:',
      lbl_service: 'Услуга:',
      lbl_date: 'Дата:',
      lbl_time: 'Время:',
      documents_title: 'Список документов',
      documents_desc: 'Выберите тип услуги — мы покажем документы по шагам.',
      wizard_steps_aria: 'Шаги',
      wiz_step_1: 'Тип',
      wiz_step_2: 'Список',
      wiz_step_3: 'Советы',
      w_type_lbl: 'Тип услуги',
      w_next: 'Далее',
      w_back: 'Назад',
      w_docs_h: 'Документы',
      w_before_h: 'Перед визитом',
      w_book_btn: 'Записаться',
      ai_title: 'AI-консультант',
      ai_desc: 'Вопросы о социальном фонде КР. Ответы носят справочный характер.',
      chat_welcome:
        'Здравствуйте! Я AI-консультант по услугам Соцфонда КР. Спросите про пенсию, пособие, документы, запись или статус заявки — или нажмите подсказку ниже.',
      chat_loading: 'Загрузка...',
      chip_q1: 'Как оформить пенсию?',
      chip_q2: 'Какие документы нужны для пособия?',
      chip_q3: 'Как проверить статус заявки?',
      chat_ph: 'Ваш вопрос...',
      chat_send: 'Отправить',
      queue_title: 'Онлайн-очередь',
      queue_desc:
        'Укажите номер заявки — покажем примерное место в очереди (демо по дате и времени записи).',
      queue_id_lbl: 'Номер заявки',
      queue_ph: 'SF-2026-1234',
      queue_show: 'Показать',
      queue_pos: '№{n} в очереди',
      queue_ahead_lbl: 'Перед вами в очереди:',
      queue_wait_lbl: 'Примерное ожидание:',
      queue_wait_note: 'мин (оценка, демо).',
      queue_people: 'чел.',
      admin_title: 'Админ-панель',
      admin_desc: 'Просмотр заявок и смена статуса. Доступ по паролю (демо).',
      admin_pass_lbl: 'Пароль администратора',
      admin_pass_ph: 'Демо: admin',
      admin_enter: 'Войти',
      admin_filter_lbl: 'Фильтр по услуге',
      admin_all_svc: 'Все услуги',
      admin_refresh: 'Обновить',
      footer_brand: 'Помощник СоцФонда',
      footer_note: 'Учебный MVP+. Данные в браузере (LocalStorage).',
      footer_copy: '© 2026',
      cabinet_empty: 'Заявок пока нет. Оформите запись в разделе «Запись».',
      cabinet_list_hint:
        'Ниже — все ваши записи: номер заявки, имя, услуга, дата и время приёма, место в общей электронной очереди (демо) и статус обработки.',
      th_number: 'Номер заявки',
      th_id: 'ID',
      th_name: 'Имя',
      th_service: 'Услуга',
      th_cabinet: 'Кабинет',
      th_specialist: 'Специалист',
      th_date: 'Дата',
      th_time: 'Время',
      th_queue: 'Очередь',
      th_status: 'Статус',
      th_action: '',
      cabinet_q_main: '№{pos} из {total}',
      cabinet_q_sub: 'Впереди: {ahead} · ~{min} мин',
      status_queue_caption: 'Место в электронной очереди (демо)',
      btn_delete: 'Удалить',
      admin_empty: 'Нет заявок.',
      confirm_delete: 'Удалить заявку {id}?',
      toast_enter_name: 'Введите имя',
      toast_welcome: 'Добро пожаловать!',
      toast_logout: 'Вы вышли из кабинета',
      toast_fill_all: 'Заполните все поля',
      toast_booking_time: 'Укажите время с 08:30 до 17:00.',
      toast_app_created: 'Заявка успешно создана',
      toast_enter_question: 'Введите вопрос',
      toast_answer_error: 'Ошибка ответа',
      toast_enter_queue_id: 'Введите номер заявки',
      toast_queue_ok: 'Очередь рассчитана',
      toast_status_not_found: 'Заявка не найдена',
      toast_found: 'Данные найдены',
      toast_admin_ok: 'Вход в админ-панель',
      toast_wrong_pass: 'Неверный пароль',
      toast_status_updated: 'Статус обновлён',
      toast_list_updated: 'Список обновлён',
      toast_deleted: 'Заявка удалена',
      ai_greeting:
        'Здравствуйте! Чем помочь: пенсия, пособие, документы, запись на приём или проверка статуса заявки?',
      ai_thanks: 'Рады помочь! Если появятся вопросы — напишите снова.',
      ai_pension_steps:
        'Как оформить пенсию:\n1) Соберите документы (см. список ниже).\n2) Запишитесь в разделе «Запись» — услуга «Пенсия».\n3) Приходите в назначенное время с паспортом.\n4) Отслеживайте статус по номеру заявки в разделе «Статус».',
      ai_booking_help:
        'Запись на приём: раздел «Запись» → укажите ФИО, услугу, дату и время (08:30–17:00). После отправки сохраните номер заявки формата SF-2026-XXXX.',
      ai_status_help:
        'Проверка статуса: раздел «Статус» → введите номер заявки (SF-2026-1234 или последние 4 цифры). Там же видна электронная очередь.',
      ai_cabinet_help:
        'Личный кабинет: раздел «Личный кабинет» → войдите по имени. Увидите свои заявки и сможете создать новую.',
      ai_hours_help:
        'Приём по записи: будни, с 08:30 до 17:00 (шаг записи — 5 минут). Точное время указываете при создании заявки.',
      ai_services_list:
        'Доступные услуги: пенсия, пособие, справка, консультация. Для каждой — свой список документов и кабинет специалиста (показывается при записи).',
      ai_hint_documents: 'Подробный мастер документов: раздел «Документы».',
      ai_hint_status: 'Полная очередь и поиск заявки: раздел «Статус».',
      ai_hint_booking: 'Создать заявку: раздел «Запись».',
      ai_app_found_title: 'Заявка {id}:',
      ai_app_not_found: 'Заявка «{id}» не найдена. Проверьте номер или создайте запись в разделе «Запись».',
      ai_queue_line:
        'Место в очереди: №{pos} из {total} (перед вами: {ahead} чел., ориентир ~{min} мин).',
      ai_fallback:
        'По вашему вопросу могу подсказать про: пенсию, пособие, документы, запись, статус заявки или очередь. Уточните, пожалуйста, или выберите подсказку ниже. Официальные решения принимает Соцфонд.',
    },
    ky: {
      page_title: 'Соцфонд жардамчысы',
      page_meta_description:
        'Соцфонд жардамчысы — онлайн кызматтар: арыздар, катталуу, статус, документтер, AI-кеңешчи.',
      skip_link: 'Мазмунга өтүү',
      logo_text: 'Соцфонд жардамчысы',
      nav_toggle_aria: 'Меню',
      nav_main_aria: 'Негизги навигация',
      lang_switch_aria: 'Интерфейстин тили',
      lang_ru_label: 'Орусча',
      lang_ky_label: 'Кыргызча',
      nav_home: 'Башкы бет',
      nav_cabinet: 'Жеке кабинет',
      nav_booking: 'Катталуу',
      nav_status: 'Статус',
      nav_documents: 'Документтер',
      nav_ai: 'AI-кеңешчи',
      nav_queue: 'Кезек',
      nav_admin: 'Админ',
      hero_badge: 'MVP+ · Социалдык фонд',
      hero_title: 'Социалдык фонддун кызматтары онлайн',
      hero_lead:
        'Арызды текшериңиз, кабыл алууга жазылаңыз, документтердин тизмесин билгиңиз же AI жардамчыга суроо бериңиз — бир терезеде.',
      btn_check_status: 'Арыздын статусун текшерүү',
      btn_book: 'Кабыл алууга жазылуу',
      btn_docs: 'Документтердин тизмесин билүү',
      btn_ai_q: 'Суроо берүү (AI)',
      mini_cabinet_h: 'Жеке кабинет',
      mini_cabinet_p: 'Аты-жөнү менен кирүү — сиздин арыздар жана тарыхы.',
      mini_cabinet_btn: 'Ачуу →',
      mini_queue_h: 'Электрондук кезек',
      mini_queue_p: 'Бардык жазылуулар жана кезек — «Статус» бөлүмүндө.',
      mini_queue_btn: 'Өтүү →',
      cabinet_h2: 'Жеке кабинет',
      cabinet_desc:
        'Өз арыздарыңызды көрүү үчүн аты-жөнүңүз менен кириңиз. Каттоо талап кылынбайт — ат бул түзмөктө «логин» катары колдонулат.',
      login_h3: 'Кирүү',
      login_name_lbl: 'Атыңыз',
      login_name_ph: 'Мисалы: Айгүл Асанова',
      btn_enter: 'Кирүү',
      cabinet_greet_start: 'Саламатсызбы,',
      cabinet_greet_end: '!',
      btn_logout: 'Чыгуу',
      my_applications_h3: 'Менин арыздарым',
      booking_title: 'Арыз берүү',
      booking_desc: 'КР Соцфондuna арызды кадамдар менен берүү: маалымат, кызмат, кабыл алуу жана ырастоо.',
      booking_steps_aria: 'Арыз кадамдары',
      booking_step_personal: 'Маалымат',
      booking_step_service: 'Кызмат',
      booking_step_visit: 'Кабыл алуу',
      booking_step_confirm: 'Ырастоо',
      booking_btn_next: 'Кийинки',
      booking_btn_back: 'Артка',
      booking_review_title: 'Маалыматты текшериңиз',
      booking_consent: 'Маалыматтын тууралыгын жана жеке маалыматты иштетүүгө макулдугумду ырастайм (демо).',
      booking_docs_title: 'Кабыл алууга документтер',
      booking_docs_note: 'Өзүңүз менен алган документтерди белгилеңиз:',
      booking_docs_required: 'Документтердин баарын белгилеңиз.',
      booking_slot_free: 'Убакыт бош — жазылса болот.',
      booking_slot_busy: 'Бул убакытка жазылуу бар. Башка убакыт тандаңыз.',
      booking_pin_invalid: 'ПИН 14 сан болушу керек.',
      booking_phone_invalid: 'Телефон номерин көрсөтүңүз (кеминде 9 сан).',
      bf_pin: 'ПИН (14 сан)',
      bf_pin_ph: '12345678901234',
      bf_phone: 'Телефон',
      bf_phone_ph: '+996 555 123 456',
      bf_email: 'Email (милдеттүү эмес)',
      bf_email_ph: 'example@mail.kg',
      bf_subtype: 'Кайрылуунун максаты',
      bf_office: 'Соцфонд бөлүмү',
      bf_comment: 'Комментарий (милдеттүү эмес)',
      bf_comment_ph: 'Арыз боюнча тактоо',
      office_bishkek: 'Борбордук бөлүм (Бишкек)',
      office_osh: 'Ош бөлүмү',
      office_jalal: 'Жалал-Абад бөлүмү',
      sub_pension_first: 'Пенсияны биринчи ыйгаруу',
      sub_pension_recalc: 'Пенсияны кайра эсептөө',
      sub_pension_transfer: 'Стажды которуу / калыбына келтирүү',
      sub_benefit_family: '«Үй-бүлөгө көмөк» жөлөмү',
      sub_benefit_child: 'Балага кам көрүү жөлөмү',
      sub_benefit_unemployment: 'Жумушсуздук жөлөмү',
      sub_cert_income: 'Киреше тууралуу маалымкат',
      sub_cert_work: 'Эмгек ишмердүүлүгү тууралуу маалымкат',
      sub_cert_pension: 'Пенсиянын өлчөмү тууралуу маалымкат',
      sub_consult_general: 'Жалпы кеңеш',
      booking_review_name: 'Аты-жөнү',
      booking_review_pin: 'ПИН',
      booking_review_phone: 'Телефон',
      booking_review_email: 'Email',
      booking_review_service: 'Кызмат',
      booking_review_subtype: 'Максат',
      booking_review_office: 'Бөлүм',
      booking_review_datetime: 'Күнү жана убакыт',
      booking_review_comment: 'Комментарий',
      booking_time_hint: 'Уруксат: 08:30–17:00 (5 мүн кадам).',
      booking_lbl_cabinet: 'Кабинет / терезе:',
      booking_lbl_employee: 'Адис:',
      booking_success_staff: 'Кабыл алуу: {cabinet}. Адис: {staff}.',
      bf_name: 'Аты-жөнү',
      bf_name_ph: 'Толук аты-жөнү',
      bf_service: 'Кызмат',
      bf_date: 'Күнү',
      bf_time: 'Убакыт',
      btn_submit_app: 'Арыз жөнөтүү',
      ph_select: '— Тандаңыз —',
      svc_pension: 'Пенсия',
      svc_benefit: 'Жөлөм',
      svc_cert: 'Маалымат',
      svc_consult: 'Кеңеш',
      booking_success:
        'Арыз ийгиликтүү түзүлдү! Сиздин номериңиз: {id}. Статусту текшерүү үчүн сактаңыз.',
      booking_modal_title: 'Арыз ийгиликтүү түзүлдү',
      booking_modal_btn: 'Макул',
      status_title: 'Статус жана электрондук кезек',
      status_desc:
        'Төмөнкүдө катталгандардын толук тизмеси (демо). Бир арыз үчүн номерди жазыңыз (формат SF-2026-1234 же кыска 4 сан, мисалы 1234).',
      status_all_queue_title: 'Кезектегилердин баары',
      status_all_queue_desc:
        'Ар бир сап — клиенттин арызы: позиция, номер, аты-жөнү, кызмат, бөлүм, күн жана убакыт, кезек жана статус.',
      status_queue_count: 'Кезекте жалпы: {n}',
      status_queue_empty: 'Каттоолор азырынча жок. «Катталуу» бөлүмүнөн жазылаңыз.',
      th_office: 'Бөлүм',
      th_position: '№',
      status_id_lbl: 'Арыз номери',
      status_id_ph: 'SF-2026-1234',
      btn_find: 'Издөө',
      status_prompt: 'Арыз номерин жазыңыз.',
      status_not_found: 'Арыз табылган жок.',
      lbl_status: 'Статус:',
      lbl_service: 'Кызмат:',
      lbl_date: 'Күнү:',
      lbl_time: 'Убакыт:',
      documents_title: 'Документтердин тизмеси',
      documents_desc: 'Кызмат түрүн тандаңыз — документтерди кадамдар менен көрсөтөбүз.',
      wizard_steps_aria: 'Кадамдар',
      wiz_step_1: 'Түрү',
      wiz_step_2: 'Тизме',
      wiz_step_3: 'Кеңештер',
      w_type_lbl: 'Кызмат түрү',
      w_next: 'Кийинки',
      w_back: 'Артка',
      w_docs_h: 'Документтер',
      w_before_h: 'Барганга чейин',
      w_book_btn: 'Жазылуу',
      ai_title: 'AI-кеңешчи',
      ai_desc: 'КР социалдык фонду боюнча суроолор. Жооптор маалыматтык мүнөздө.',
      chat_welcome:
        'Саламатсызбы! Мен КР Соцфондунун AI-кеңешчисимин. Пенсия, жөлөм, документтер, катталуу же арыздын статусу жөнүндө сураңыз — же төмөнкү баскычты басыңыз.',
      chat_loading: 'Жүктөлүүдө...',
      chip_q1: 'Пенсияны кантип тариздөө керек?',
      chip_q2: 'Жөлөм үчүн кандай документтер керек?',
      chip_q3: 'Арыздын статусун кантип текшерүү керек?',
      chat_ph: 'Сурооңуз...',
      chat_send: 'Жөнөтүү',
      queue_title: 'Онлайн кезек',
      queue_desc:
        'Арыз номерин көрсөтүңүз — кезектеги болжолдуу орунду көрсөтөбүз (демо: дата жана убакыт боюнча).',
      queue_id_lbl: 'Арыз номери',
      queue_ph: 'SF-2026-1234',
      queue_show: 'Көрсөтүү',
      queue_pos: 'Кезекте №{n}',
      queue_ahead_lbl: 'Сизден алдыда:',
      queue_wait_lbl: 'Болжолдуу күтүү:',
      queue_wait_note: 'мүн (баалоо, демо).',
      queue_people: 'адам',
      admin_title: 'Админ панели',
      admin_desc: 'Арыздарды көрүү жана статусту өзгөртүү. Пароль менен кирүү (демо).',
      admin_pass_lbl: 'Администратордун сырсөзү',
      admin_pass_ph: 'Демо: admin',
      admin_enter: 'Кирүү',
      admin_filter_lbl: 'Кызмат боюнча чыпка',
      admin_all_svc: 'Бардык кызматтар',
      admin_refresh: 'Жаңылоо',
      footer_brand: 'Соцфонд жардамчысы',
      footer_note: 'Окуу MVP+. Маалыматтар браузерде (LocalStorage).',
      footer_copy: '© 2026',
      cabinet_empty: 'Арыздар азырынча жок. «Катталуу» бөлүмүнөн жазылаңыз.',
      cabinet_list_hint:
        'Төмөнкүдө бардык жазылууларыңыз: арыз номери, аты-жөнү, кызмат, кабыл алуу күнү жана убактысы, жалпы электрондук кезектеги орун (демо) жана иштетүү статусу.',
      th_number: 'Арыз номери',
      th_id: 'ID',
      th_name: 'Аты-жөнү',
      th_service: 'Кызмат',
      th_cabinet: 'Кабинет',
      th_specialist: 'Адис',
      th_date: 'Күнү',
      th_time: 'Убакыт',
      th_queue: 'Кезек',
      th_status: 'Статус',
      th_action: '',
      cabinet_q_main: '№{pos} / {total}',
      cabinet_q_sub: 'Алдыда: {ahead} · ~{min} мүн',
      status_queue_caption: 'Электрондук кезекте орун (демо)',
      btn_delete: 'Өчүрүү',
      admin_empty: 'Арыздар жок.',
      confirm_delete: '{id} арызын өчүрөсүзбү?',
      toast_enter_name: 'Атыңызды жазыңыз',
      toast_welcome: 'Кош келиңиз!',
      toast_logout: 'Кабинеттен чыктыңыз',
      toast_fill_all: 'Бардык талааларды толтуруңуз',
      toast_booking_time: 'Убакытты 08:30–17:00 аралыгында көрсөтүңүз.',
      toast_app_created: 'Арыз ийгиликтүү түзүлдү',
      toast_enter_question: 'Суроо жазыңыз',
      toast_answer_error: 'Жооп катасы',
      toast_enter_queue_id: 'Арыз номерин жазыңыз',
      toast_queue_ok: 'Кезек эсептелди',
      toast_status_not_found: 'Арыз табылган жок',
      toast_found: 'Маалымат табылды',
      toast_admin_ok: 'Админ панелине кирүү',
      toast_wrong_pass: 'Туура эмес сырсөз',
      toast_status_updated: 'Статус жаңыланды',
      toast_list_updated: 'Тизме жаңыланды',
      toast_deleted: 'Арыз өчүрүлдү',
      ai_greeting:
        'Саламатсызбы! Эмне жардам берейин: пенсия, жөлөм, документтер, катталуу же арыздын статусу?',
      ai_thanks: 'Сурооңуз болсо — кайра жазыңыз.',
      ai_pension_steps:
        'Пенсияны тариздөө:\n1) Документтерди даярдаңыз (тизме төмөндө).\n2) «Катталуу» бөлүмүнөн «Пенсия» кызматын тандаңыз.\n3) Белгиленген убакта паспорт менен келүү.\n4) Арыз номери боюнча «Статус» бөлүмүнөн көзөмөл.',
      ai_booking_help:
        'Катталуу: «Катталуу» → аты-жөнү, кызмат, дата жана убакыт (08:30–17:00). Жөнөткөндөн кийин SF-2026-XXXX форматындагы номерди сактаңыз.',
      ai_status_help:
        'Статус: «Статус» → арыз номери (SF-2026-1234 же акыркы 4 сан). Электрондук кезек да ошол жерде.',
      ai_cabinet_help:
        'Жеке кабинет: «Жеке кабинет» → атыңыз менен кириңиз. Арыздарыңыз көрүнөт.',
      ai_hours_help:
        'Кабыл алуу: жумуш күндөрү, 08:30–17:00. Убакытты катталууда тандайсыз.',
      ai_services_list:
        'Кызматтар: пенсия, жөлөм, маалымат, кеңеш. Ар бири үчүн документтер жана адистин кабинети көрсөтүлөт.',
      ai_hint_documents: 'Документтер: «Документтер» бөлүмү.',
      ai_hint_status: 'Кезек жана издөө: «Статус» бөлүмү.',
      ai_hint_booking: 'Арыз түзүү: «Катталуу» бөлүмү.',
      ai_app_found_title: 'Арыз {id}:',
      ai_app_not_found: '«{id}» табылган жок. Номерди текшериңиз же «Катталуу» бөлүмүнөн арыз түзүңүз.',
      ai_queue_line: 'Кезекте: №{pos} / {total} (алдыңда: {ahead} киши, ~{min} мүн).',
      ai_fallback:
        'Сурооңуз боюнча пенсия, жөлөм, документтер, катталуу же статус жөнүндө айта алам. Тактаңыз же төмөнкү баскычты тандаңыз.',
    },
    en: {
      page_title: 'Social Fund Assistant',
      page_meta_description:
        'Social Fund Assistant — online services: applications, booking, status, documents, AI consultant.',
      skip_link: 'Skip to content',
      logo_text: 'Social Fund Assistant',
      nav_toggle_aria: 'Menu',
      nav_main_aria: 'Main navigation',
      lang_switch_aria: 'Interface language',
      nav_home: 'Home',
      nav_cabinet: 'Account',
      nav_booking: 'Booking',
      nav_status: 'Status',
      nav_documents: 'Documents',
      nav_ai: 'AI assistant',
      nav_queue: 'Queue',
      nav_admin: 'Admin',
      hero_badge: 'MVP+ · Social Fund',
      hero_title: 'Social Fund services online',
      hero_lead:
        'Check your application, book an appointment, see required documents, or ask the AI assistant — all in one place.',
      btn_check_status: 'Check application status',
      btn_book: 'Book an appointment',
      btn_docs: 'Required documents',
      btn_ai_q: 'Ask a question (AI)',
      mini_cabinet_h: 'Personal account',
      mini_cabinet_p: 'Sign in with your name — your applications and history.',
      mini_cabinet_btn: 'Open →',
      mini_queue_h: 'Electronic queue',
      mini_queue_p: 'All bookings and the queue are under “Status”.',
      mini_queue_btn: 'Go →',
      cabinet_h2: 'Personal account',
      cabinet_desc:
        'Enter your name to see your applications. No registration — your name acts as a login on this device.',
      login_h3: 'Sign in',
      login_name_lbl: 'Your name',
      login_name_ph: 'e.g. Aigul Asanova',
      btn_enter: 'Sign in',
      cabinet_greet_start: 'Hello,',
      cabinet_greet_end: '!',
      btn_logout: 'Sign out',
      my_applications_h3: 'My applications',
      booking_title: 'Submit application',
      booking_desc:
        'Step-by-step application to the Social Fund: personal data, service, appointment, and confirmation.',
      booking_steps_aria: 'Application steps',
      booking_step_personal: 'Details',
      booking_step_service: 'Service',
      booking_step_visit: 'Visit',
      booking_step_confirm: 'Confirm',
      booking_btn_next: 'Next',
      booking_btn_back: 'Back',
      booking_review_title: 'Review your data',
      booking_consent:
        'I confirm the data is correct and agree to personal data processing (demo mode).',
      booking_docs_title: 'Documents for your visit',
      booking_docs_note: 'Check documents you will bring:',
      booking_docs_required: 'Please check all documents in the list.',
      booking_slot_free: 'This time slot is available.',
      booking_slot_busy: 'This time is already booked. Please choose another.',
      booking_pin_invalid: 'PIN must be exactly 14 digits.',
      booking_phone_invalid: 'Enter a phone number (at least 9 digits).',
      bf_pin: 'PIN (14 digits)',
      bf_pin_ph: '12345678901234',
      bf_phone: 'Phone',
      bf_phone_ph: '+996 555 123 456',
      bf_email: 'Email (optional)',
      bf_email_ph: 'example@mail.kg',
      bf_subtype: 'Purpose of visit',
      bf_office: 'Social Fund office',
      bf_comment: 'Comment (optional)',
      bf_comment_ph: 'Notes for your application',
      office_bishkek: 'Central office (Bishkek)',
      office_osh: 'Osh office',
      office_jalal: 'Jalal-Abad office',
      sub_pension_first: 'First pension grant',
      sub_pension_recalc: 'Pension recalculation',
      sub_pension_transfer: 'Transfer / restore work history',
      sub_benefit_family: 'Family support benefit',
      sub_benefit_child: 'Child care benefit',
      sub_benefit_unemployment: 'Unemployment benefit',
      sub_cert_income: 'Income certificate',
      sub_cert_work: 'Employment certificate',
      sub_cert_pension: 'Pension amount certificate',
      sub_consult_general: 'General consultation',
      booking_review_name: 'Full name',
      booking_review_pin: 'PIN',
      booking_review_phone: 'Phone',
      booking_review_email: 'Email',
      booking_review_service: 'Service',
      booking_review_subtype: 'Purpose',
      booking_review_office: 'Office',
      booking_review_datetime: 'Date and time',
      booking_review_comment: 'Comment',
      booking_time_hint: 'Allowed time: 08:30–17:00 (5-minute steps).',
      booking_lbl_cabinet: 'Desk / office:',
      booking_lbl_employee: 'Specialist:',
      booking_success_staff: 'Desk: {cabinet}. Specialist: {staff}.',
      bf_name: 'Name',
      bf_name_ph: 'Full name',
      bf_service: 'Service',
      bf_date: 'Date',
      bf_time: 'Time',
      btn_submit_app: 'Submit application',
      ph_select: '— Select —',
      svc_pension: 'Pension',
      svc_benefit: 'Benefit',
      svc_cert: 'Certificate',
      svc_consult: 'Consultation',
      booking_success:
        'Application created successfully! Your number: {id}. Save it to check the status later.',
      booking_modal_title: 'Application created',
      booking_modal_btn: 'OK',
      status_title: 'Status & e-queue',
      status_desc:
        'Below is the full list of everyone who booked (demo). Enter an application number (format SF-2026-1234 or just 4 digits, e.g. 1234) to see one record.',
      status_all_queue_title: 'Everyone in the queue',
      status_all_queue_desc:
        'Each row is a booking: position, number, name, service, office, date and time, queue place, and status.',
      status_queue_count: 'Total in queue: {n}',
      status_queue_empty: 'No bookings yet. Create one in the “Booking” section.',
      th_office: 'Office',
      th_position: '#',
      status_id_lbl: 'Application number',
      status_id_ph: 'SF-2026-1234',
      btn_find: 'Search',
      status_prompt: 'Enter the application number.',
      status_not_found: 'Application not found.',
      lbl_status: 'Status:',
      lbl_service: 'Service:',
      lbl_date: 'Date:',
      lbl_time: 'Time:',
      documents_title: 'List of documents',
      documents_desc: 'Choose the service type — we will show documents step by step.',
      wizard_steps_aria: 'Steps',
      wiz_step_1: 'Type',
      wiz_step_2: 'List',
      wiz_step_3: 'Tips',
      w_type_lbl: 'Service type',
      w_next: 'Next',
      w_back: 'Back',
      w_docs_h: 'Documents',
      w_before_h: 'Before your visit',
      w_book_btn: 'Book',
      ai_title: 'AI consultant',
      ai_desc: 'Questions about the Social Fund of the Kyrgyz Republic. Answers are for reference only.',
      chat_welcome:
        'Hello! I am the AI assistant for Social Fund services. Ask about pension, benefits, documents, booking, or application status — or tap a suggestion below.',
      chat_loading: 'Loading...',
      chip_q1: 'How do I apply for a pension?',
      chip_q2: 'What documents are needed for a benefit?',
      chip_q3: 'How do I check application status?',
      chat_ph: 'Your question...',
      chat_send: 'Send',
      queue_title: 'Online queue',
      queue_desc:
        'Enter your application number — we show an estimated place in the queue (demo by date and time).',
      queue_id_lbl: 'Application number',
      queue_ph: 'SF-2026-1234',
      queue_show: 'Show',
      queue_pos: 'No. {n} in queue',
      queue_ahead_lbl: 'People ahead of you:',
      queue_wait_lbl: 'Estimated wait:',
      queue_wait_note: 'min (demo estimate).',
      queue_people: 'people',
      admin_title: 'Admin panel',
      admin_desc: 'View applications and change status. Password access (demo).',
      admin_pass_lbl: 'Administrator password',
      admin_pass_ph: 'Demo: admin',
      admin_enter: 'Sign in',
      admin_filter_lbl: 'Filter by service',
      admin_all_svc: 'All services',
      admin_refresh: 'Refresh',
      footer_brand: 'Social Fund Assistant',
      footer_note: 'Educational MVP+. Data in the browser (LocalStorage).',
      footer_copy: '© 2026',
      cabinet_empty: 'No applications yet. Create one in the “Booking” section.',
      cabinet_list_hint:
        'Below are all your bookings: application number, name, service, date and time of visit, place in the shared electronic queue (demo), and processing status.',
      th_number: 'App. no.',
      th_id: 'ID',
      th_name: 'Name',
      th_service: 'Service',
      th_cabinet: 'Desk',
      th_specialist: 'Specialist',
      th_date: 'Date',
      th_time: 'Time',
      th_queue: 'Queue',
      th_status: 'Status',
      th_action: '',
      cabinet_q_main: 'No. {pos} of {total}',
      cabinet_q_sub: 'Ahead: {ahead} · ~{min} min',
      status_queue_caption: 'Place in e-queue (demo)',
      btn_delete: 'Delete',
      admin_empty: 'No applications.',
      confirm_delete: 'Delete application {id}?',
      toast_enter_name: 'Enter your name',
      toast_welcome: 'Welcome!',
      toast_logout: 'You signed out',
      toast_fill_all: 'Fill in all fields',
      toast_booking_time: 'Choose a time between 08:30 and 17:00.',
      toast_app_created: 'Application created',
      toast_enter_question: 'Enter a question',
      toast_answer_error: 'Response error',
      toast_enter_queue_id: 'Enter application number',
      toast_queue_ok: 'Queue calculated',
      toast_status_not_found: 'Application not found',
      toast_found: 'Data found',
      toast_admin_ok: 'Signed in to admin',
      toast_wrong_pass: 'Wrong password',
      toast_status_updated: 'Status updated',
      toast_list_updated: 'List refreshed',
      toast_deleted: 'Application deleted',
      ai_greeting:
        'Hello! How can I help: pension, benefits, documents, booking, or application status?',
      ai_thanks: 'Glad to help! Ask again anytime.',
      ai_pension_steps:
        'How to apply for a pension:\n1) Gather documents (see list below).\n2) Book in “Booking” — service “Pension”.\n3) Come at your appointment time with your passport.\n4) Track status by application number in “Status”.',
      ai_booking_help:
        'Booking: go to “Booking” → enter your name, service, date and time (08:30–17:00). Save your application number SF-2026-XXXX after submit.',
      ai_status_help:
        'Status check: “Status” → enter application number (SF-2026-1234 or last 4 digits). The electronic queue is there too.',
      ai_cabinet_help:
        'Personal account: “Personal account” → sign in with your name to see your applications.',
      ai_hours_help:
        'Appointments: weekdays, 08:30–17:00. You choose the exact slot when booking.',
      ai_services_list:
        'Services: pension, benefit, certificate, consultation. Each has its own documents and specialist office (shown when booking).',
      ai_hint_documents: 'Document wizard: “Documents” section.',
      ai_hint_status: 'Full queue and lookup: “Status” section.',
      ai_hint_booking: 'Create an application: “Booking” section.',
      ai_app_found_title: 'Application {id}:',
      ai_app_not_found: 'Application “{id}” not found. Check the number or create one in “Booking”.',
      ai_queue_line: 'Queue position: No. {pos} of {total} ({ahead} ahead, ~{min} min estimate).',
      ai_fallback:
        'I can help with pension, benefits, documents, booking, status, or queue. Please clarify or pick a suggestion below. Official decisions are made by the Social Fund.',
    },
  };

  (function mergeBookingCatalog() {
    var cat = typeof SocFondBookingCatalog !== 'undefined' ? SocFondBookingCatalog : null;
    if (!cat || !cat.BOOKING_CATALOG_I18N) return;
    ['ru', 'ky'].forEach(function (lang) {
      if (TRANSLATIONS[lang] && cat.BOOKING_CATALOG_I18N[lang]) {
        Object.assign(TRANSLATIONS[lang], cat.BOOKING_CATALOG_I18N[lang]);
      }
    });
    if (cat.BOOKING_SUBTYPE_EXTRA) {
      Object.keys(cat.BOOKING_SUBTYPE_EXTRA).forEach(function (k) {
        BOOKING_SUBTYPE_KEYS[k] = cat.BOOKING_SUBTYPE_EXTRA[k];
      });
    }
  })();

  function $(id) {
    return document.getElementById(id);
  }

  function getLang() {
    try {
      var v = localStorage.getItem(STORAGE_LANG);
      if (v === 'en') {
        localStorage.setItem(STORAGE_LANG, 'ru');
        return 'ru';
      }
      if (v === 'ru' || v === 'ky') return v;
    } catch (e) {}
    return 'ru';
  }

  function setLang(lang) {
    if (lang !== 'ru' && lang !== 'ky') lang = 'ru';
    try {
      localStorage.setItem(STORAGE_LANG, lang);
    } catch (e) {}
    document.documentElement.lang = lang;
    applyI18n();
    refreshCabinetIfVisible();
    refreshAdminIfVisible();
    refreshWizardOpenPanels();
    refreshStatusQueueIfVisible();
    refreshBookingStaffIfVisible();
  }

  function refreshStatusQueueIfVisible() {
    var sec = $('status');
    if (sec && !sec.hidden) renderStatusQueueList();
  }

  function t(key, params) {
    var lang = getLang();
    var map = TRANSLATIONS[lang] || TRANSLATIONS.ru;
    var s = map[key] !== undefined ? map[key] : TRANSLATIONS.ru[key];
    if (s === undefined) s = key;
    if (params) {
      Object.keys(params).forEach(function (k) {
        s = s.split('{' + k + '}').join(params[k]);
      });
    }
    return s;
  }

  function serviceLabel(svc) {
    var label = t('svc_' + svc);
    if (label && label !== 'svc_' + svc) return label;
    var L = SERVICE_BY_LANG[getLang()] || SERVICE_BY_LANG.ru;
    return L[svc] || svc;
  }

  /** Пол по ПИН КР (демо: 1-я цифра 1/3 — муж., 2/4 — жен.) */
  function genderFromPin(pin) {
    var d = String(pin || '').replace(/\D/g, '');
    if (d.length < 14) return 'u';
    var first = parseInt(d.charAt(0), 10);
    if (first === 1 || first === 3 || first === 5 || first === 7) return 'm';
    if (first === 2 || first === 4 || first === 6 || first === 8) return 'f';
    var second = parseInt(d.charAt(1), 10);
    if (!isNaN(second)) return second % 2 === 0 ? 'f' : 'm';
    return 'u';
  }

  function appGender(app) {
    if (!app) return 'u';
    if (app.gender === 'm' || app.gender === 'f') return app.gender;
    return genderFromPin(app.pin);
  }

  function officeLabel(officeId) {
    if (!officeId) return '—';
    var cat = typeof SocFondBookingCatalog !== 'undefined' ? SocFondBookingCatalog : null;
    var id = officeId;
    if (cat && cat.OFFICE_LEGACY && cat.OFFICE_LEGACY[officeId]) {
      id = cat.OFFICE_LEGACY[officeId];
    }
    var label = t('office_' + id);
    if (label && label !== 'office_' + id) return label;
    return officeId;
  }

  function fillServiceSelect(selectEl, opts) {
    if (!selectEl) return;
    opts = opts || {};
    var cat = typeof SocFondBookingCatalog !== 'undefined' ? SocFondBookingCatalog : null;
    if (!cat) return;
    var prev = selectEl.value;
    selectEl.innerHTML = '';
    if (opts.placeholder !== false) {
      var ph = document.createElement('option');
      ph.value = '';
      ph.textContent = t('ph_select');
      selectEl.appendChild(ph);
    }
    cat.BOOKING_SERVICE_GROUPS.forEach(function (grp) {
      var og = document.createElement('optgroup');
      og.label = t(grp.groupKey);
      grp.services.forEach(function (key) {
        var opt = document.createElement('option');
        opt.value = key;
        opt.textContent = serviceLabel(key);
        og.appendChild(opt);
      });
      selectEl.appendChild(og);
    });
    if (prev) selectEl.value = prev;
  }

  function fillOfficeSelect(selectEl) {
    if (!selectEl) return;
    var cat = typeof SocFondBookingCatalog !== 'undefined' ? SocFondBookingCatalog : null;
    if (!cat) return;
    var prev = selectEl.value;
    selectEl.innerHTML = '';
    cat.BOOKING_OFFICE_REGIONS.forEach(function (reg) {
      var og = document.createElement('optgroup');
      og.label = t(reg.regionKey);
      reg.offices.forEach(function (officeId) {
        var opt = document.createElement('option');
        opt.value = officeId;
        opt.textContent = officeLabel(officeId);
        og.appendChild(opt);
      });
      selectEl.appendChild(og);
    });
    if (prev) selectEl.value = prev;
    if (!selectEl.value && selectEl.options.length) {
      selectEl.selectedIndex = 0;
    }
  }

  function fillAdminServiceFilter(selectEl) {
    if (!selectEl) return;
    var prev = selectEl.value;
    selectEl.innerHTML = '';
    var all = document.createElement('option');
    all.value = '';
    all.textContent = t('admin_all_svc');
    selectEl.appendChild(all);
    var cat = typeof SocFondBookingCatalog !== 'undefined' ? SocFondBookingCatalog : null;
    if (cat && cat.allServiceKeys) {
      cat.allServiceKeys().forEach(function (key) {
        var opt = document.createElement('option');
        opt.value = key;
        opt.textContent = serviceLabel(key);
        selectEl.appendChild(opt);
      });
    }
    if (prev) selectEl.value = prev;
  }

  function fillBookingCatalogs() {
    fillServiceSelect($('bfService'));
    fillOfficeSelect($('bfOffice'));
    fillServiceSelect($('wType'));
    fillAdminServiceFilter($('adminFilter'));
  }

  function statusLabel(st) {
    var L = STATUS_BY_LANG[getLang()] || STATUS_BY_LANG.ru;
    return L[st] || st;
  }

  function getBookingStaff(serviceKey) {
    var tab = BOOKING_STAFF[getLang()] || BOOKING_STAFF.ru;
    var key = serviceKey;
    var cat = typeof SocFondBookingCatalog !== 'undefined' ? SocFondBookingCatalog : null;
    if (cat && cat.BOOKING_STAFF_ALIAS && cat.BOOKING_STAFF_ALIAS[serviceKey]) {
      key = cat.BOOKING_STAFF_ALIAS[serviceKey];
    }
    return tab[key] || tab.consult || { cabinet: '—', staff: '—' };
  }

  /** Время в диапазоне 08:30–17:00 включительно */
  function isBookingTimeValid(timeStr) {
    if (!timeStr) return false;
    var p = timeStr.split(':');
    var h = parseInt(p[0], 10);
    var m = parseInt(p[1] || '0', 10);
    if (isNaN(h) || isNaN(m)) return false;
    var mins = h * 60 + m;
    return mins >= 8 * 60 + 30 && mins <= 17 * 60;
  }

  function getWizardBlock(key) {
    var bundle = WIZARD_BY_LANG[getLang()] || WIZARD_BY_LANG.ru;
    if (bundle[key]) return bundle[key];
    var cat = typeof SocFondBookingCatalog !== 'undefined' ? SocFondBookingCatalog : null;
    if (cat && cat.WIZARD_SERVICE_ALIAS && cat.WIZARD_SERVICE_ALIAS[key]) {
      return bundle[cat.WIZARD_SERVICE_ALIAS[key]] || null;
    }
    return null;
  }

  function getAiSystemPrompt() {
    return AI_SYSTEM_PROMPTS[getLang()] || AI_SYSTEM_PROMPTS.ru;
  }

  function applyI18n() {
    var lang = getLang();
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!key) return;
      el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', t(key));
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      if (key) el.setAttribute('aria-label', t(key));
    });

    document.querySelectorAll('[data-i18n-q]').forEach(function (chip) {
      var k = chip.getAttribute('data-i18n-q');
      if (k) {
        var text = t(k);
        chip.textContent = text;
        chip.setAttribute('data-q', text);
      }
    });

    document.title = t('page_title');
    var meta = $('metaDesc');
    if (meta) meta.setAttribute('content', t('page_meta_description'));

    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      var btnLang = btn.getAttribute('data-lang');
      var isThis = btnLang === lang;
      btn.classList.toggle('lang-switch__btn--active', isThis);
      btn.setAttribute('aria-pressed', isThis ? 'true' : 'false');
      if (btnLang === 'ru' || btnLang === 'ky') {
        btn.setAttribute('title', t('lang_' + btnLang + '_label'));
      }
    });

    fillBookingCatalogs();

    var statusSec = $('status');
    if (statusSec && !statusSec.hidden) renderStatusQueueList();

    var bookingSec = $('booking');
    if (bookingSec && !bookingSec.hidden) {
      fillSubtypeOptions($('bfService') && $('bfService').value);
      renderBookingDocsList();
      if (bookingWizardStep === 4) renderBookingReview();
    }
  }

  function refreshCabinetIfVisible() {
    var sec = $('cabinet');
    if (sec && !sec.hidden) refreshCabinet();
  }

  function refreshAdminIfVisible() {
    var sec = $('admin');
    if (sec && !sec.hidden && isAdmin()) renderAdminTable();
  }

  function fillList(ul, items) {
    if (!ul) return;
    ul.innerHTML = '';
    items.forEach(function (text) {
      var li = document.createElement('li');
      li.textContent = text;
      ul.appendChild(li);
    });
  }

  function wizardDocLines(data) {
    if (!data) return [];
    var lines = [];
    if (data.itemsHeading) lines.push('— ' + data.itemsHeading + ' —');
    data.items.forEach(function (item) {
      lines.push(item);
    });
    if (data.sections) {
      data.sections.forEach(function (sec) {
        lines.push(sec.title);
        sec.items.forEach(function (item) {
          lines.push('• ' + item);
        });
      });
    }
    return lines;
  }

  function refreshWizardOpenPanels() {
    var wType = $('wType');
    if (!wType || !wType.value) return;
    var data = getWizardBlock(wType.value);
    if (!data) return;
    var p2 = $('wPanel2');
    var p3 = $('wPanel3');
    if (p2 && !p2.hidden) {
      $('wDocTitle').textContent = data.title;
      fillList($('wDocList'), wizardDocLines(data));
    }
    if (p3 && !p3.hidden) {
      fillList($('wTipsList'), data.tips);
    }
  }

  function initLangSwitcher() {
    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        if (lang) setLang(lang);
      });
    });
  }

  // --- LocalStorage: заявки ---

  function loadApplications() {
    try {
      var raw = localStorage.getItem(STORAGE_APPS);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveApplications(arr) {
    localStorage.setItem(STORAGE_APPS, JSON.stringify(arr));
  }

  /** Демо-очередь для страницы «Статус», если заявок ещё нет */
  function ensureDemoQueueApplications() {
    try {
      if (localStorage.getItem(STORAGE_DEMO_QUEUE)) return;
    } catch (e) {}
    var existing = loadApplications();
    if (existing.length > 0) {
      try {
        localStorage.setItem(STORAGE_DEMO_QUEUE, '1');
      } catch (e2) {}
      return;
    }
    var y = new Date().getFullYear();
    var day = '2026-05-16';
    var rows = [
      { id: 'SF-' + y + '-1001', name: 'Асанов Бакыт Темирович', pin: '10051401234567', phone: '+996 555 100 101', service: 'pension', office: 'bishkek_center', date: day, time: '08:30', status: 'done' },
      { id: 'SF-' + y + '-1002', name: 'Омурбекова Айгүл Аскаровна', pin: '20051402234568', phone: '+996 555 100 102', service: 'certificate', office: 'bishkek_center', date: day, time: '09:00', status: 'done' },
      { id: 'SF-' + y + '-1003', name: 'Токтогулов Нурлан Бекович', pin: '10051403234569', phone: '+996 555 100 103', service: 'benefit_family', office: 'osh_city', date: day, time: '09:30', status: 'processing' },
      { id: 'SF-' + y + '-1004', name: 'Садыкова Гульнара Кадыровна', pin: '20051404234570', phone: '+996 555 100 104', service: 'benefit_child', office: 'osh_city', date: day, time: '10:00', status: 'processing' },
      { id: 'SF-' + y + '-1005', name: 'Абдыкалыков Бекжан Талантбекович', pin: '10051405234571', phone: '+996 555 100 105', service: 'pension_age', office: 'jalal_abad', date: day, time: '10:30', status: 'accepted' },
      { id: 'SF-' + y + '-1006', name: 'Исакова Айжан Маматовна', pin: '20051406234572', phone: '+996 555 100 106', service: 'benefit_maternity', office: 'karakol', date: day, time: '11:00', status: 'accepted' },
      { id: 'SF-' + y + '-1007', name: 'Калиев Эрлан Сооронбаевич', pin: '10051407234573', phone: '+996 555 100 107', service: 'consult', office: 'naryn', date: day, time: '11:30', status: 'accepted' },
      { id: 'SF-' + y + '-1008', name: 'Жумабекова Айпери Токтосуновна', pin: '20051408234574', phone: '+996 555 100 108', service: 'cert_pension_size', office: 'talas', date: day, time: '12:00', status: 'accepted' },
      { id: 'SF-' + y + '-1009', name: 'Мамытов Канат Абдыкадырович', pin: '10051409234575', phone: '+996 555 100 109', service: 'experience', office: 'tokmok', date: day, time: '13:00', status: 'accepted' },
      { id: 'SF-' + y + '-1010', name: 'Бекмурзаева Жылдыз Асылбековна', pin: '20051410234576', phone: '+996 555 100 110', service: 'pension_disability', office: 'batken', date: day, time: '14:00', status: 'accepted' },
      { id: 'SF-' + y + '-1011', name: 'Нурланов Тимур Эркинович', pin: '10051411234577', phone: '+996 555 100 111', service: 'savings', office: 'balykchy', date: day, time: '15:00', status: 'accepted' },
      { id: 'SF-' + y + '-1012', name: 'Асылбекова Майрам Асылбековна', pin: '20051412234578', phone: '+996 555 100 112', service: 'pension_recalc', office: 'bishkek_leninsky', date: day, time: '16:00', status: 'accepted' },
    ];
    var demo = rows.map(function (r) {
      var staff = getBookingStaff(r.service);
      return {
        id: r.id,
        name: r.name,
        pin: r.pin,
        phone: r.phone,
        email: '',
        service: r.service,
        serviceSubtype: '',
        office: r.office,
        comment: '',
        date: r.date,
        time: r.time,
        cabinet: staff.cabinet,
        staffName: staff.staff,
        status: r.status,
        gender: genderFromPin(r.pin),
        createdAt: r.date + 'T' + r.time + ':00.000Z',
      };
    });
    saveApplications(demo);
    try {
      localStorage.setItem(STORAGE_DEMO_QUEUE, '1');
    } catch (e3) {}
  }

  /** Номер заявки: SF-ГГГГ-NNNN (ровно 4 цифры в конце). */
  function generateApplicationId() {
    var y = new Date().getFullYear();
    var apps = loadApplications();
    var id;
    do {
      var num = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
      id = 'SF-' + y + '-' + num;
    } while (
      apps.some(function (a) {
        return a.id === id;
      })
    );
    return id;
  }

  function findApplicationById(id) {
    if (!id) return null;
    var raw = String(id).trim();
    var apps = loadApplications();

    if (/^\d{1,4}$/.test(raw)) {
      var tail = raw.padStart(4, '0');
      var y = new Date().getFullYear();
      var matches = apps.filter(function (a) {
        var part = a.id.split('-').pop();
        return part === tail;
      });
      if (matches.length === 1) return matches[0];
      var cur = matches.filter(function (a) {
        return a.id.toUpperCase().indexOf('SF-' + y + '-') === 0;
      });
      if (cur.length === 1) return cur[0];
      return matches[0] || null;
    }

    var q = raw.toUpperCase();
    return (
      apps.find(function (a) {
        return a.id.toUpperCase() === q;
      }) || null
    );
  }

  /** Сортировка заявок для расчёта очереди (дата + время). */
  function sortKey(a) {
    return a.date + 'T' + (a.time || '00:00');
  }

  function getSortedApplications() {
    return loadApplications().slice().sort(function (a, b) {
      return sortKey(a).localeCompare(sortKey(b));
    });
  }

  /** Место заявки в общей электронной очереди (демо, сортировка по дате и времени). */
  function getQueueInfoForId(appId) {
    var apps = getSortedApplications();
    var idx = apps.findIndex(function (a) {
      return a.id.toUpperCase() === String(appId).trim().toUpperCase();
    });
    if (idx < 0) return null;
    return {
      position: idx + 1,
      total: apps.length,
      ahead: idx,
      waitMin: idx * 12,
    };
  }

  function normalizeName(n) {
    return String(n || '')
      .trim()
      .toLowerCase();
  }

  function getSessionUser() {
    try {
      var raw = sessionStorage.getItem(SESSION_USER);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setSessionUser(name) {
    sessionStorage.setItem(SESSION_USER, JSON.stringify({ name: name.trim() }));
  }

  function clearSessionUser() {
    sessionStorage.removeItem(SESSION_USER);
  }

  function isAdmin() {
    return sessionStorage.getItem(SESSION_ADMIN) === '1';
  }

  function setAdmin(on) {
    if (on) sessionStorage.setItem(SESSION_ADMIN, '1');
    else sessionStorage.removeItem(SESSION_ADMIN);
  }

  // --- Навигация ---

  function showSection(id) {
    if (id === 'queue') id = 'status';
    if (id === 'reception') id = 'home';

    document.querySelectorAll('.section').forEach(function (sec) {
      var on = sec.id === id;
      sec.hidden = !on;
      sec.classList.toggle('section--active', on);
    });
    document.querySelectorAll('.nav a[data-nav]').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-nav') === id);
    });
    if (history.replaceState) {
      history.replaceState(null, '', '#' + id);
    }
    window.scrollTo(0, 0);

    if (id === 'cabinet') refreshCabinet();
    if (id === 'admin') refreshAdminGate();
    if (id === 'status') renderStatusQueueList();
    if (id === 'booking') {
      prefillBookingForm();
      setBookingStep(1);
      updateBookingStaffInfo();
    }
    if (id === 'ai') ensureChatWelcome();
  }

  function initNavigation() {
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var id = el.getAttribute('data-nav');
        if (!id) return;
        if (
          el.tagName === 'A' &&
          el.getAttribute('href') &&
          el.getAttribute('href').indexOf('#') === 0
        ) {
          e.preventDefault();
        }
        showSection(id);
        var nav = $('mainNav');
        var toggle = $('navToggle');
        if (nav && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    window.addEventListener('hashchange', function () {
      var h = window.location.hash.slice(1);
      if (h === 'queue') showSection('status');
      else if (h === 'reception') showSection('home');
      else if (h && $(h)) showSection(h);
    });

    if (window.location.hash) {
      var h0 = window.location.hash.slice(1);
      if (h0 === 'queue') showSection('status');
      else if (h0 === 'reception') showSection('home');
      else if ($(h0)) showSection(h0);
    }
  }

  function initMobileNav() {
    var toggle = $('navToggle');
    var nav = $('mainNav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function toast(msg, type) {
    type = type || 'info';
    var root = $('toastRoot');
    if (!root) return;
    var el = document.createElement('div');
    el.className =
      'toast' + (type === 'ok' ? ' toast--ok' : type === 'err' ? ' toast--err' : '');
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(function () {
        el.remove();
      }, 300);
    }, 3200);
  }

  function globalLoader(show) {
    var el = $('globalLoader');
    if (!el) return;
    el.hidden = !show;
  }

  // --- Кабинет ---

  function refreshCabinet() {
    var user = getSessionUser();
    var loginBox = $('cabinetLogin');
    var dash = $('cabinetDashboard');
    if (!loginBox || !dash) return;

    if (!user || !user.name) {
      loginBox.hidden = false;
      dash.hidden = true;
      return;
    }

    loginBox.hidden = true;
    dash.hidden = false;
    $('cabinetUserName').textContent = user.name;

    var nameNorm = normalizeName(user.name);
    var apps = loadApplications().filter(function (a) {
      return normalizeName(a.name) === nameNorm;
    });

    var wrap = $('cabinetList');
    if (!apps.length) {
      wrap.innerHTML = '<p class="section__desc">' + escapeHtml(t('cabinet_empty')) + '</p>';
      return;
    }

    var html =
      '<table class="data-table data-table--cabinet"><thead><tr><th>' +
      escapeHtml(t('th_number')) +
      '</th><th>' +
      escapeHtml(t('th_name')) +
      '</th><th>' +
      escapeHtml(t('th_service')) +
      '</th><th>' +
      escapeHtml(t('th_cabinet')) +
      '</th><th>' +
      escapeHtml(t('th_specialist')) +
      '</th><th>' +
      escapeHtml(t('th_date')) +
      '</th><th>' +
      escapeHtml(t('th_time')) +
      '</th><th>' +
      escapeHtml(t('th_queue')) +
      '</th><th>' +
      escapeHtml(t('th_status')) +
      '</th><th>' +
      escapeHtml(t('th_action')) +
      '</th></tr></thead><tbody>';
    apps.forEach(function (a) {
      var q = getQueueInfoForId(a.id);
      var qMain = q
        ? t('cabinet_q_main', { pos: String(q.position), total: String(q.total) })
        : '—';
      var qSub =
        q &&
        t('cabinet_q_sub', {
          ahead: String(q.ahead),
          min: String(q.waitMin),
        });
      var dlCab = function (key) {
        return ' data-label="' + escapeHtml(t(key)) + '"';
      };
      html +=
        '<tr><td' +
        dlCab('th_number') +
        '><code class="app-id">' +
        escapeHtml(a.id) +
        '</code></td><td' +
        dlCab('th_name') +
        '>' +
        escapeHtml(a.name) +
        '</td><td' +
        dlCab('th_service') +
        '>' +
        escapeHtml(serviceLabel(a.service)) +
        '</td><td' +
        dlCab('th_cabinet') +
        '>' +
        escapeHtml(a.cabinet || '—') +
        '</td><td' +
        dlCab('th_specialist') +
        '>' +
        escapeHtml(a.staffName || '—') +
        '</td><td' +
        dlCab('th_date') +
        '>' +
        escapeHtml(a.date) +
        '</td><td' +
        dlCab('th_time') +
        '>' +
        escapeHtml(a.time) +
        '</td><td class="cabinet-queue-cell"' +
        dlCab('th_queue') +
        '>' +
        (q
          ? '<span class="cabinet-queue__main">' +
            escapeHtml(qMain) +
            '</span><br><span class="cabinet-queue__sub">' +
            escapeHtml(qSub) +
            '</span>'
          : '<span class="cabinet-queue__main">—</span>') +
        '</td><td' +
        dlCab('th_status') +
        '><span class="' +
        statusClass(a.status) +
        '">' +
        escapeHtml(statusLabel(a.status)) +
        '</span></td><td' +
        dlCab('th_action') +
        '><button type="button" class="btn btn--outline btn--sm" data-del="' +
        escapeHtml(a.id) +
        '">' +
        escapeHtml(t('btn_delete')) +
        '</button></td></tr>';
    });
    html += '</tbody></table>';
    wrap.innerHTML = html;

    wrap.querySelectorAll('[data-del]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-del');
        if (confirm(t('confirm_delete', { id: id }))) {
          deleteApplication(id);
          toast(t('toast_deleted'), 'ok');
          refreshCabinet();
        }
      });
    });
  }

  function deleteApplication(id) {
    var apps = loadApplications().filter(function (a) {
      return a.id !== id;
    });
    saveApplications(apps);
  }

  function initCabinet() {
    $('btnLogin').addEventListener('click', function () {
      var name = ($('loginName').value || '').trim();
      if (!name) {
        toast(t('toast_enter_name'), 'err');
        return;
      }
      setSessionUser(name);
      toast(t('toast_welcome'), 'ok');
      refreshCabinet();
    });

    $('btnLogout').addEventListener('click', function () {
      clearSessionUser();
      toast(t('toast_logout'), 'ok');
      refreshCabinet();
    });
  }

  // --- Запись ---

  /** Закрытие модального окна успешной заявки */
  function bookingModalOnEscape(e) {
    if (e.key === 'Escape') closeBookingSuccessModal();
  }

  function refreshBookingStaffIfVisible() {
    var sec = $('booking');
    if (sec && !sec.hidden) updateBookingStaffInfo();
  }

  function updateBookingStaffInfo() {
    var sel = $('bfService');
    var box = $('bookingStaffInfo');
    if (!box) return;
    var svc = sel && sel.value;
    if (!svc) {
      box.hidden = true;
      return;
    }
    var st = getBookingStaff(svc);
    var cEl = $('bookingStaffCabinet');
    var nEl = $('bookingStaffName');
    if (cEl) cEl.textContent = st.cabinet;
    if (nEl) nEl.textContent = st.staff;
    box.hidden = false;
  }

  function openBookingSuccessModal(app) {
    var textEl = $('bookingModalText');
    var staffEl = $('bookingModalStaff');
    var modal = $('bookingSuccessModal');
    if (!textEl || !modal) return;
    textEl.textContent = t('booking_success', { id: app.id });
    if (staffEl) {
      if (app.cabinet && app.staffName) {
        staffEl.textContent = t('booking_success_staff', {
          cabinet: app.cabinet,
          staff: app.staffName,
        });
        staffEl.hidden = false;
      } else {
        staffEl.textContent = '';
        staffEl.hidden = true;
      }
    }
    modal.hidden = false;
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', bookingModalOnEscape);
    setTimeout(function () {
      var btn = $('bookingModalClose');
      if (btn) btn.focus();
    }, 80);
  }

  function closeBookingSuccessModal() {
    var modal = $('bookingSuccessModal');
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', bookingModalOnEscape);
  }

  function initBookingSuccessModal() {
    var backdrop = $('bookingModalBackdrop');
    var btn = $('bookingModalClose');
    if (btn) btn.addEventListener('click', closeBookingSuccessModal);
    if (backdrop) backdrop.addEventListener('click', closeBookingSuccessModal);
  }

  function getStoredPin() {
    try {
      return sessionStorage.getItem(SESSION_PIN) || '';
    } catch (e) {
      return '';
    }
  }

  function bookingWizardFormHtml() {
    return (
      '<div class="booking-panel booking-panel--active" data-bstep="1">' +
      '<h3 class="booking-panel__title" data-i18n="booking_step_personal"></h3>' +
      '<label class="label" for="bfName"><span data-i18n="bf_name"></span> <span class="req">*</span></label>' +
      '<input type="text" id="bfName" class="input" required autocomplete="name" />' +
      '<label class="label" for="bfPin"><span data-i18n="bf_pin"></span> <span class="req">*</span></label>' +
      '<input type="text" id="bfPin" class="input" inputmode="numeric" maxlength="14" required />' +
      '<label class="label" for="bfPhone"><span data-i18n="bf_phone"></span> <span class="req">*</span></label>' +
      '<input type="tel" id="bfPhone" class="input" required autocomplete="tel" />' +
      '<label class="label" for="bfEmail" data-i18n="bf_email"></label>' +
      '<input type="email" id="bfEmail" class="input" autocomplete="email" />' +
      '</div>' +
      '<div class="booking-panel" data-bstep="2" hidden>' +
      '<h3 class="booking-panel__title" data-i18n="booking_step_service"></h3>' +
      '<label class="label" for="bfService"><span data-i18n="bf_service"></span> <span class="req">*</span></label>' +
      '<select id="bfService" class="input" required></select>' +
      '<label class="label" for="bfSubtype"><span data-i18n="bf_subtype"></span> <span class="req">*</span></label>' +
      '<select id="bfSubtype" class="input" required disabled><option value="" data-i18n="ph_select"></option></select>' +
      '<label class="label" for="bfOffice"><span data-i18n="bf_office"></span> <span class="req">*</span></label>' +
      '<select id="bfOffice" class="input" required></select>' +
      '<div id="bookingStaffInfo" class="booking-staff" hidden>' +
      '<p class="booking-staff__row"><span class="booking-staff__lbl" data-i18n="booking_lbl_cabinet"></span> <span id="bookingStaffCabinet" class="booking-staff__val"></span></p>' +
      '<p class="booking-staff__row"><span class="booking-staff__lbl" data-i18n="booking_lbl_employee"></span> <span id="bookingStaffName" class="booking-staff__val"></span></p></div>' +
      '<label class="label" for="bfComment" data-i18n="bf_comment"></label>' +
      '<textarea id="bfComment" class="input booking-textarea" rows="2"></textarea></div>' +
      '<div class="booking-panel" data-bstep="3" hidden>' +
      '<h3 class="booking-panel__title" data-i18n="booking_step_visit"></h3>' +
      '<label class="label" for="bfDate"><span data-i18n="bf_date"></span> <span class="req">*</span></label>' +
      '<input type="date" id="bfDate" class="input" required />' +
      '<p class="booking-time-hint section__desc" data-i18n="booking_time_hint"></p>' +
      '<label class="label" for="bfTime"><span data-i18n="bf_time"></span> <span class="req">*</span></label>' +
      '<input type="time" id="bfTime" class="input" required min="08:30" max="17:00" step="300" />' +
      '<p id="bookingSlotHint" class="booking-slot-hint" hidden role="status"></p>' +
      '<div id="bookingDocsBlock" class="booking-docs" hidden><h4 class="booking-docs__title" data-i18n="booking_docs_title"></h4>' +
      '<p class="section__desc booking-docs__note" data-i18n="booking_docs_note"></p><ul id="bookingDocsList" class="booking-docs__list"></ul></div></div>' +
      '<div class="booking-panel" data-bstep="4" hidden>' +
      '<h3 class="booking-panel__title" data-i18n="booking_review_title"></h3>' +
      '<div id="bookingReview" class="booking-review"></div>' +
      '<label class="booking-check booking-check--consent"><input type="checkbox" id="bfConsent" required />' +
      '<span data-i18n="booking_consent"></span></label></div>' +
      '<div class="booking-wizard__nav">' +
      '<button type="button" class="btn btn--outline" id="bookingBtnBack" data-i18n="booking_btn_back" hidden>Назад</button>' +
      '<button type="button" class="btn btn--primary" id="bookingBtnNext" data-i18n="booking_btn_next">Далее</button>' +
      '<button type="submit" class="btn btn--primary" id="bookingBtnSubmit" data-i18n="btn_submit_app" hidden>Отправить</button></div>'
    );
  }

  function upgradeBookingWizard() {
    if ($('bookingBtnNext')) return;
    var sec = $('booking');
    if (!sec) return;
    var container = sec.querySelector('.container');
    if (!container) return;
    var title = container.querySelector('h2');
    if (!title) return;
    container.querySelectorAll('.booking-steps, .section__desc, #bookingForm').forEach(function (el) {
      el.remove();
    });
    title.insertAdjacentHTML(
      'afterend',
      '<p class="section__desc" data-i18n="booking_desc"></p>' +
        '<nav class="booking-steps">' +
        '<span class="booking-steps__item booking-steps__item--active" data-bstep-ind="1"><span class="booking-steps__num">1</span><span data-i18n="booking_step_personal"></span></span>' +
        '<span class="booking-steps__item" data-bstep-ind="2"><span class="booking-steps__num">2</span><span data-i18n="booking_step_service"></span></span>' +
        '<span class="booking-steps__item" data-bstep-ind="3"><span class="booking-steps__num">3</span><span data-i18n="booking_step_visit"></span></span>' +
        '<span class="booking-steps__item" data-bstep-ind="4"><span class="booking-steps__num">4</span><span data-i18n="booking_step_confirm"></span></span>' +
        '</nav>' +
        '<form id="bookingForm" class="card booking-wizard" novalidate></form>'
    );
    var form = $('bookingForm');
    if (form) form.innerHTML = bookingWizardFormHtml();
  }

function setBookingStep(step) {
    bookingWizardStep = step;
    document.querySelectorAll('.booking-panel').forEach(function (p) {
      var on = parseInt(p.getAttribute('data-bstep'), 10) === step;
      p.hidden = !on;
      p.classList.toggle('booking-panel--active', on);
    });
    document.querySelectorAll('.booking-steps__item').forEach(function (s) {
      var sn = parseInt(s.getAttribute('data-bstep-ind'), 10);
      s.classList.toggle('booking-steps__item--active', sn === step);
      s.classList.toggle('booking-steps__item--done', sn < step);
    });
    var back = $('bookingBtnBack');
    var next = $('bookingBtnNext');
    var submit = $('bookingBtnSubmit');
    if (back) back.hidden = step <= 1;
    if (next) {
      var hideNext = step >= 4;
      next.hidden = hideNext;
      next.setAttribute('aria-hidden', hideNext ? 'true' : 'false');
    }
    if (submit) {
      var showSubmit = step === 4;
      submit.hidden = !showSubmit;
      submit.setAttribute('aria-hidden', showSubmit ? 'false' : 'true');
    }
    if (step === 3) {
      renderBookingDocsList();
      checkBookingSlot();
    }
    if (step === 4) renderBookingReview();
    var sec = $('booking');
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function prefillBookingForm() {
    var user = getSessionUser();
    if (user && user.name && $('bfName')) $('bfName').value = user.name;
    var pin = getStoredPin();
    if (pin && $('bfPin')) $('bfPin').value = pin;
  }

  function fillSubtypeOptions(service) {
    var sel = $('bfSubtype');
    if (!sel) return;
    sel.innerHTML = '<option value="">' + escapeHtml(t('ph_select')) + '</option>';
    if (!service) {
      sel.disabled = true;
      return;
    }
    sel.disabled = false;
    (BOOKING_SUBTYPE_KEYS[service] || []).forEach(function (key) {
      var opt = document.createElement('option');
      opt.value = key;
      opt.textContent = t(key);
      sel.appendChild(opt);
    });
  }

  function normalizePhone(s) {
    return String(s || '').replace(/\D/g, '');
  }

  function isValidPin(pin) {
    return /^\d{14}$/.test(String(pin || '').replace(/\D/g, ''));
  }

  function isSlotTaken(date, time) {
    return loadApplications().some(function (a) {
      return a.date === date && a.time === time;
    });
  }

  function checkBookingSlot() {
    var hint = $('bookingSlotHint');
    var date = $('bfDate') && $('bfDate').value;
    var time = $('bfTime') && $('bfTime').value;
    if (!hint || !date || !time) {
      if (hint) hint.hidden = true;
      return true;
    }
    var busy = isSlotTaken(date, time);
    hint.hidden = false;
    hint.className = 'booking-slot-hint ' + (busy ? 'booking-slot-hint--busy' : 'booking-slot-hint--ok');
    hint.textContent = t(busy ? 'booking_slot_busy' : 'booking_slot_free');
    return !busy;
  }

  function renderBookingDocsList() {
    var block = $('bookingDocsBlock');
    var ul = $('bookingDocsList');
    var svc = $('bfService') && $('bfService').value;
    if (!block || !ul) return;
    var data = getWizardBlock(svc);
    if (!data || !data.items.length) {
      block.hidden = true;
      return;
    }
    block.hidden = false;
    ul.innerHTML = '';
    data.items.forEach(function (item, i) {
      var li = document.createElement('li');
      li.className = 'booking-docs__item';
      li.innerHTML =
        '<label class="booking-check"><input type="checkbox" class="booking-doc-cb" data-doc-idx="' +
        i +
        '" required /> <span>' +
        escapeHtml(item) +
        '</span></label>';
      ul.appendChild(li);
    });
  }

  function allBookingDocsChecked() {
    var cbs = document.querySelectorAll('.booking-doc-cb');
    if (!cbs.length) return true;
    for (var i = 0; i < cbs.length; i++) {
      if (!cbs[i].checked) return false;
    }
    return true;
  }

  function readBookingForm() {
    return {
      name: ($('bfName') && $('bfName').value || '').trim(),
      pin: ($('bfPin') && $('bfPin').value || '').replace(/\D/g, ''),
      phone: ($('bfPhone') && $('bfPhone').value || '').trim(),
      email: ($('bfEmail') && $('bfEmail').value || '').trim(),
      service: $('bfService') && $('bfService').value,
      subtype: $('bfSubtype') && $('bfSubtype').value,
      office: $('bfOffice') && $('bfOffice').value,
      comment: ($('bfComment') && $('bfComment').value || '').trim(),
      date: $('bfDate') && $('bfDate').value,
      time: $('bfTime') && $('bfTime').value,
    };
  }

  function validateBookingStep(step) {
    var d = readBookingForm();
    if (step === 1) {
      if (d.name.length < 3) {
        toast(t('toast_fill_all'), 'err');
        return false;
      }
      if (!isValidPin(d.pin)) {
        toast(t('booking_pin_invalid'), 'err');
        return false;
      }
      if (normalizePhone(d.phone).length < 9) {
        toast(t('booking_phone_invalid'), 'err');
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!d.service || !d.subtype || !d.office) {
        toast(t('toast_fill_all'), 'err');
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!d.date || !d.time) {
        toast(t('toast_fill_all'), 'err');
        return false;
      }
      if (!isBookingTimeValid(d.time)) {
        toast(t('toast_booking_time'), 'err');
        return false;
      }
      if (!checkBookingSlot()) {
        toast(t('booking_slot_busy'), 'err');
        return false;
      }
      if (!allBookingDocsChecked()) {
        toast(t('booking_docs_required'), 'err');
        return false;
      }
      return true;
    }
    if (step === 4) {
      if (!$('bfConsent') || !$('bfConsent').checked) {
        toast(t('toast_fill_all'), 'err');
        return false;
      }
      return true;
    }
    return true;
  }

  function renderBookingReview() {
    var box = $('bookingReview');
    if (!box) return;
    var d = readBookingForm();
    var rows = [
      [t('booking_review_name'), d.name],
      [t('booking_review_pin'), d.pin],
      [t('booking_review_phone'), d.phone],
      [t('booking_review_email'), d.email || '—'],
      [t('booking_review_service'), serviceLabel(d.service)],
      [t('booking_review_subtype'), t(d.subtype)],
      [t('booking_review_office'), officeLabel(d.office)],
      [t('booking_review_datetime'), d.date + ' ' + d.time],
    ];
    if (d.comment) rows.push([t('booking_review_comment'), d.comment]);
    var staff = getBookingStaff(d.service);
    rows.push([t('booking_lbl_cabinet'), staff.cabinet]);
    rows.push([t('booking_lbl_employee'), staff.staff]);
    box.innerHTML =
      '<dl class="booking-review__list">' +
      rows
        .map(function (r) {
          return '<dt>' + escapeHtml(r[0]) + '</dt><dd>' + escapeHtml(r[1]) + '</dd>';
        })
        .join('') +
      '</dl>';
  }

  function submitBookingApplication() {
    if (!validateBookingStep(4)) return;
    var d = readBookingForm();
    var staff = getBookingStaff(d.service);
    var app = {
      id: generateApplicationId(),
      name: d.name,
      pin: d.pin,
      phone: d.phone,
      email: d.email,
      service: d.service,
      serviceSubtype: d.subtype,
      office: d.office,
      comment: d.comment,
      date: d.date,
      time: d.time,
      cabinet: staff.cabinet,
      staffName: staff.staff,
      status: 'accepted',
      gender: genderFromPin(d.pin),
      createdAt: new Date().toISOString(),
    };
    var apps = loadApplications();
    apps.push(app);
    saveApplications(apps);
    setSessionUser(d.name);
    var secStatus = $('status');
    if (secStatus && !secStatus.hidden) renderStatusQueueList();
    openBookingSuccessModal(app);
    var form = $('bookingForm');
    if (form) form.reset();
    applyBookingDateMin();
    fillSubtypeOptions('');
    updateBookingStaffInfo();
    setBookingStep(1);
    prefillBookingForm();
  }

  function applyBookingDateMin() {
    var dateEl = $('bfDate');
    if (!dateEl) return;
    var t0 = new Date();
    dateEl.min =
      t0.getFullYear() +
      '-' +
      String(t0.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(t0.getDate()).padStart(2, '0');
  }

  function applyBookingTimeLimits() {
    var timeEl = $('bfTime');
    if (!timeEl) return;
    timeEl.min = BOOKING_TIME_MIN;
    timeEl.max = BOOKING_TIME_MAX;
    timeEl.setAttribute('min', BOOKING_TIME_MIN);
    timeEl.setAttribute('max', BOOKING_TIME_MAX);
  }

  function initBooking() {
    upgradeBookingWizard();
    applyI18n();
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (key && t(key)) el.setAttribute('placeholder', t(key));
    });
    if ($('bfName')) $('bfName').setAttribute('data-i18n-placeholder', 'bf_name_ph');
    if ($('bfPin')) $('bfPin').setAttribute('data-i18n-placeholder', 'bf_pin_ph');
    if ($('bfPhone')) $('bfPhone').setAttribute('data-i18n-placeholder', 'bf_phone_ph');
    if ($('bfEmail')) $('bfEmail').setAttribute('data-i18n-placeholder', 'bf_email_ph');
    if ($('bfComment')) $('bfComment').setAttribute('data-i18n-placeholder', 'bf_comment_ph');

    applyBookingTimeLimits();
    applyBookingDateMin();

    var svcEl = $('bfService');
    if (svcEl) {
      svcEl.addEventListener('change', function () {
        fillSubtypeOptions(svcEl.value);
        updateBookingStaffInfo();
        renderBookingDocsList();
      });
    }

    var dateEl = $('bfDate');
    var timeEl = $('bfTime');
    if (dateEl) dateEl.addEventListener('change', checkBookingSlot);
    if (timeEl) timeEl.addEventListener('change', checkBookingSlot);

    var nextBtn = $('bookingBtnNext');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (!validateBookingStep(bookingWizardStep)) return;
        setBookingStep(bookingWizardStep + 1);
      });
    }
    var backBtn = $('bookingBtnBack');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        if (bookingWizardStep > 1) setBookingStep(bookingWizardStep - 1);
      });
    }

    var form = $('bookingForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        submitBookingApplication();
      });
    }

    prefillBookingForm();
    setBookingStep(1);
  }

  function statusClass(st) {
    return (
      'status-badge status-badge--' +
      (st === 'done' ? 'done' : st === 'processing' ? 'processing' : 'accepted')
    );
  }

  /** Полная электронная очередь на странице «Статус» (все клиенты). */
  function renderStatusQueueList(highlightId) {
    var wrap = $('statusQueueList');
    if (!wrap) return;
    var apps = getSortedApplications();
    var countEl = $('statusQueueCount');
    if (countEl) {
      countEl.textContent = apps.length ? t('status_queue_count', { n: String(apps.length) }) : '';
    }
    if (!apps.length) {
      wrap.innerHTML =
        '<p class="section__desc">' + escapeHtml(t('status_queue_empty')) + '</p>';
      return;
    }
    var html =
      '<table class="data-table data-table--status-queue"><thead><tr><th>' +
      escapeHtml(t('th_position')) +
      '</th><th>' +
      escapeHtml(t('th_number')) +
      '</th><th>' +
      escapeHtml(t('th_name')) +
      '</th><th>' +
      escapeHtml(t('th_service')) +
      '</th><th>' +
      escapeHtml(t('th_office')) +
      '</th><th>' +
      escapeHtml(t('th_cabinet')) +
      '</th><th>' +
      escapeHtml(t('th_specialist')) +
      '</th><th>' +
      escapeHtml(t('th_date')) +
      '</th><th>' +
      escapeHtml(t('th_time')) +
      '</th><th>' +
      escapeHtml(t('th_queue')) +
      '</th><th>' +
      escapeHtml(t('th_status')) +
      '</th></tr></thead><tbody>';
    var hiTarget = highlightId ? findApplicationById(highlightId) : null;
    apps.forEach(function (a, i) {
      var pos = i + 1;
      var q = getQueueInfoForId(a.id);
      var qCell;
      if (q) {
        qCell =
          '<span class="cabinet-queue__main">' +
          escapeHtml(t('cabinet_q_main', { pos: String(q.position), total: String(q.total) })) +
          '</span><br><span class="cabinet-queue__sub">' +
          escapeHtml(
            t('cabinet_q_sub', { ahead: String(q.ahead), min: String(q.waitMin) })
          ) +
          '</span>';
      } else {
        qCell = '<span class="cabinet-queue__main">—</span>';
      }
      var hi = hiTarget && hiTarget.id === a.id;
      var dl = function (key) {
        return ' data-label="' + escapeHtml(t(key)) + '"';
      };
      html +=
        '<tr class="status-queue-row' +
        (hi ? ' status-queue-row--highlight' : '') +
        '" data-app-id="' +
        escapeHtml(a.id) +
        '"><td' +
        dl('th_position') +
        ' data-pos="' +
        escapeHtml(String(pos)) +
        '"><strong>' +
        escapeHtml(String(pos)) +
        '</strong></td><td' +
        dl('th_number') +
        '><code class="app-id">' +
        escapeHtml(a.id) +
        '</code></td><td' +
        dl('th_name') +
        '>' +
        escapeHtml(a.name) +
        '</td><td' +
        dl('th_service') +
        '>' +
        escapeHtml(serviceLabel(a.service)) +
        '</td><td class="status-queue-office"' +
        dl('th_office') +
        '>' +
        escapeHtml(officeLabel(a.office)) +
        '</td><td' +
        dl('th_cabinet') +
        '>' +
        escapeHtml(a.cabinet || '—') +
        '</td><td' +
        dl('th_specialist') +
        '>' +
        escapeHtml(a.staffName || '—') +
        '</td><td' +
        dl('th_date') +
        '>' +
        escapeHtml(a.date) +
        '</td><td' +
        dl('th_time') +
        '>' +
        escapeHtml(a.time) +
        '</td><td class="cabinet-queue-cell"' +
        dl('th_queue') +
        '>' +
        qCell +
        '</td><td' +
        dl('th_status') +
        '><span class="' +
        statusClass(a.status) +
        '">' +
        escapeHtml(statusLabel(a.status)) +
        '</span></td></tr>';
    });
    html += '</tbody></table>';
    wrap.innerHTML = html;
    if (highlightId) {
      var hiApp = findApplicationById(highlightId);
      if (hiApp) {
        var row = wrap.querySelector('tr[data-app-id="' + hiApp.id.replace(/"/g, '\\"') + '"]');
        if (row) row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  function runStatusLookup() {
    var id = ($('statusId') && $('statusId').value || '').trim();
    var box = $('statusResult');
    if (!box) return;
    if (!id) {
      box.innerHTML = '<p>' + escapeHtml(t('status_prompt')) + '</p>';
      renderStatusQueueList();
      return;
    }
    var app = findApplicationById(id);
    if (!app) {
      box.innerHTML = '<p>' + escapeHtml(t('status_not_found')) + '</p>';
      toast(t('toast_status_not_found'), 'err');
      renderStatusQueueList();
      return;
    }
    renderStatusQueueList(app.id);
    var q = getQueueInfoForId(app.id);
    var qBlock = '';
    if (q) {
      qBlock =
        '<div class="status-result__queue">' +
        '<p class="status-result__queue-cap">' +
        escapeHtml(t('status_queue_caption')) +
        '</p>' +
        '<p class="status-result__queue-main">' +
        escapeHtml(t('cabinet_q_main', { pos: String(q.position), total: String(q.total) })) +
        '</p>' +
        '<p class="status-result__queue-sub">' +
        escapeHtml(t('cabinet_q_sub', { ahead: String(q.ahead), min: String(q.waitMin) })) +
        '</p></div>';
    }
    box.innerHTML =
      '<p><strong>' +
      escapeHtml(t('th_name')) +
      ':</strong> ' +
      escapeHtml(app.name) +
      '</p>' +
      '<p><strong>' +
      escapeHtml(t('lbl_status')) +
      '</strong> <span class="' +
      statusClass(app.status) +
      '">' +
      escapeHtml(statusLabel(app.status)) +
      '</span></p>' +
      '<p><strong>' +
      escapeHtml(t('lbl_service')) +
      '</strong> ' +
      escapeHtml(serviceLabel(app.service)) +
      (app.serviceSubtype ? ' — ' + escapeHtml(t(app.serviceSubtype)) : '') +
      '</p>' +
      (app.phone
        ? '<p><strong>' +
          escapeHtml(t('booking_review_phone')) +
          ':</strong> ' +
          escapeHtml(app.phone) +
          '</p>'
        : '') +
      (app.office
        ? '<p><strong>' +
          escapeHtml(t('booking_review_office')) +
          ':</strong> ' +
          escapeHtml(officeLabel(app.office)) +
          '</p>'
        : '') +
      '<p><strong>' +
      escapeHtml(t('booking_lbl_cabinet')) +
      '</strong> ' +
      escapeHtml(app.cabinet || '—') +
      '</p>' +
      '<p><strong>' +
      escapeHtml(t('booking_lbl_employee')) +
      '</strong> ' +
      escapeHtml(app.staffName || '—') +
      '</p>' +
      '<p><strong>' +
      escapeHtml(t('lbl_date')) +
      '</strong> ' +
      escapeHtml(app.date) +
      '</p>' +
      '<p><strong>' +
      escapeHtml(t('lbl_time')) +
      '</strong> ' +
      escapeHtml(app.time) +
      '</p>' +
      '<p><strong>' +
      escapeHtml(t('th_number')) +
      ':</strong> <code class="app-id">' +
      escapeHtml(app.id) +
      '</code></p>' +
      qBlock;
    toast(t('toast_found'), 'ok');
  }

  function initStatus() {
    ensureDemoQueueApplications();
    renderStatusQueueList();
    $('btnStatusCheck').addEventListener('click', runStatusLookup);
    var statusInput = $('statusId');
    if (statusInput) {
      statusInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          runStatusLookup();
        }
      });
    }
  }

  // --- Wizard ---

  function initWizard() {
    var wType = $('wType');
    var next1 = $('wNext1');
    var p1 = $('wPanel1');
    var p2 = $('wPanel2');
    var p3 = $('wPanel3');
    var steps = document.querySelectorAll('.wizard__step');

    function setStep(n) {
      [p1, p2, p3].forEach(function (p, i) {
        if (!p) return;
        var on = i + 1 === n;
        p.classList.toggle('active', on);
        p.hidden = !on;
      });
      steps.forEach(function (s) {
        var sn = parseInt(s.getAttribute('data-wstep'), 10);
        s.classList.remove('active');
        if (sn === n) s.classList.add('active');
      });
    }

    wType.addEventListener('change', function () {
      next1.disabled = !wType.value;
    });

    $('wNext1').addEventListener('click', function () {
      var key = wType.value;
      var data = getWizardBlock(key);
      if (!data) return;
      $('wDocTitle').textContent = data.title;
      fillList($('wDocList'), wizardDocLines(data));
      fillList($('wTipsList'), data.tips);
      setStep(2);
    });

    $('wBack2').addEventListener('click', function () {
      setStep(1);
    });
    $('wNext2').addEventListener('click', function () {
      setStep(3);
    });
    $('wBack3').addEventListener('click', function () {
      setStep(2);
    });
  }

  // --- AI-консультант (локальная база знаний + данные портала) ---

  var chatHistory = [];
  var chatUiBound = false;

  function normalizeAiQuery(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function queryMatches(text, keywords) {
    var q = normalizeAiQuery(text);
    return keywords.some(function (kw) {
      if (kw instanceof RegExp) return kw.test(q);
      return q.indexOf(String(kw).toLowerCase()) >= 0;
    });
  }

  function extractApplicationIdFromText(text) {
    var raw = String(text || '');
    var full = raw.match(/SF[-\s]?(\d{4})[-\s]?(\d{4})/i);
    if (full) return 'SF-' + full[1] + '-' + full[2];

    if (
      queryMatches(raw, [
        'статус',
        'status',
        'заявк',
        'арыз',
        'очеред',
        'queue',
        'кезек',
        'номер',
        'number',
        'найти',
        'табу',
        'find',
        'провер',
        'текшер',
        'check',
      ])
    ) {
      var digits = raw.match(/\b(\d{4})\b/);
      if (digits) return digits[1];
    }
    return null;
  }

  function formatServiceDocsReply(serviceKey) {
    var data = getWizardBlock(serviceKey);
    if (!data) return '';
    var lines = [data.title, ''];
    if (data.itemsHeading) {
      lines.push(data.itemsHeading);
      lines.push('');
    }
    data.items.forEach(function (item, i) {
      lines.push(i + 1 + '. ' + item);
    });
    if (data.sections && data.sections.length) {
      data.sections.forEach(function (sec) {
        lines.push('');
        lines.push(sec.title);
        sec.items.forEach(function (item) {
          lines.push('• ' + item);
        });
      });
    }
    if (data.tips && data.tips.length) {
      lines.push('');
      lines.push(t('w_before_h') + ':');
      data.tips.forEach(function (tip) {
        lines.push('• ' + tip);
      });
    }
    var staff = (BOOKING_STAFF[getLang()] || BOOKING_STAFF.ru)[serviceKey];
    if (staff) {
      lines.push('');
      lines.push(t('booking_lbl_cabinet') + ' ' + staff.cabinet);
      lines.push(t('booking_lbl_employee') + ' ' + staff.staff);
    }
    lines.push('');
    lines.push(t('ai_hint_documents'));
    return lines.join('\n');
  }

  function formatApplicationStatusReply(app) {
    var q = getQueueInfoForId(app.id);
    var lines = [t('ai_app_found_title', { id: app.id })];
    lines.push(t('lbl_status') + ' ' + statusLabel(app.status));
    lines.push(t('lbl_service') + ' ' + serviceLabel(app.service));
    lines.push(t('lbl_date') + ' ' + (app.date || '—'));
    lines.push(t('lbl_time') + ' ' + (app.time || '—'));
    if (app.cabinet) lines.push(t('booking_lbl_cabinet') + ' ' + app.cabinet);
    if (app.staffName) lines.push(t('booking_lbl_employee') + ' ' + app.staffName);
    if (q) {
      lines.push(
        t('ai_queue_line', {
          pos: String(q.position),
          total: String(q.total),
          ahead: String(q.ahead),
          min: String(q.waitMin),
        })
      );
    }
    lines.push(t('ai_hint_status'));
    return lines.join('\n');
  }

  function consultAi(userText) {
    if (typeof window.portalEnhancedAiReply === 'function') {
      var portalReply = window.portalEnhancedAiReply(userText);
      if (portalReply) return Promise.resolve(portalReply);
    }

    var appId = extractApplicationIdFromText(userText);
    if (appId) {
      var app = findApplicationById(appId);
      if (app) return Promise.resolve(formatApplicationStatusReply(app));
      return Promise.resolve(t('ai_app_not_found', { id: appId }));
    }

    var q = normalizeAiQuery(userText);

    if (queryMatches(q, ['привет', 'здравств', 'салам', 'hello', 'hi', 'сәлем', 'саламат'])) {
      return Promise.resolve(t('ai_greeting'));
    }

    if (queryMatches(q, ['спасибо', 'рахмат', 'thank'])) {
      return Promise.resolve(t('ai_thanks'));
    }

    if (queryMatches(q, ['пенси', 'pension', 'penisia'])) {
      return Promise.resolve(t('ai_pension_steps') + '\n\n' + formatServiceDocsReply('pension'));
    }

    if (queryMatches(q, ['пособ', 'жөлөм', 'benefit', 'allowance'])) {
      return Promise.resolve(formatServiceDocsReply('benefit'));
    }

    if (queryMatches(q, ['справк', 'certificate', 'маалымат'])) {
      return Promise.resolve(formatServiceDocsReply('certificate'));
    }

    if (
      queryMatches(q, [
        'документ',
        'document',
        'какие нужн',
        'кандай документ',
        'документтер керек',
        'керек документ',
        'what document',
        'список док',
      ])
    ) {
      if (queryMatches(q, ['пенси', 'pension'])) return Promise.resolve(formatServiceDocsReply('pension'));
      if (queryMatches(q, ['пособ', 'жөлөм', 'benefit', 'үй-бүлө', 'family'])) {
        return Promise.resolve(formatServiceDocsReply('benefit'));
      }
      return Promise.resolve(
        formatServiceDocsReply('pension') + '\n\n—\n\n' + formatServiceDocsReply('benefit')
      );
    }

    if (
      queryMatches(q, [
        'запис',
        'каттал',
        'book',
        'appointment',
        'приём',
        'прием',
        'кабыл',
        'оформить заяв',
      ])
    ) {
      return Promise.resolve(t('ai_booking_help') + '\n\n' + t('ai_hint_booking'));
    }

    if (
      queryMatches(q, [
        'статус',
        'status',
        'провер',
        'текшер',
        'check',
        'заявк',
        'арыз',
        'application',
      ])
    ) {
      return Promise.resolve(t('ai_status_help'));
    }

    if (queryMatches(q, ['очеред', 'queue', 'кезек', 'жду', 'wait', 'күт'])) {
      return Promise.resolve(t('ai_status_help'));
    }

    if (
      queryMatches(q, [
        'кабинет',
        'cabinet',
        'войти',
        'login',
        'личн',
        'жеке',
        'account',
        'вход',
        'кири',
      ])
    ) {
      var user = getSessionUser();
      if (user && user.name) {
        var apps = loadApplications().filter(function (a) {
          return normalizeName(a.name) === normalizeName(user.name);
        });
        if (apps.length) {
          return Promise.resolve(
            t('ai_cabinet_help') +
              '\n\n' +
              user.name +
              ': ' +
              apps.length +
              ' — ' +
              t('my_applications_h3').toLowerCase() +
              '. ' +
              t('ai_hint_status')
          );
        }
      }
      return Promise.resolve(t('ai_cabinet_help'));
    }

    if (
      queryMatches(q, [
        'время',
        'час',
        '08:30',
        '17:00',
        'график',
        'schedule',
        'hours',
        'когда',
        'убакыт',
        'when',
      ])
    ) {
      return Promise.resolve(t('ai_hours_help'));
    }

    if (queryMatches(q, ['услуг', 'кызмат', 'service', 'что можно', 'what can'])) {
      return Promise.resolve(t('ai_services_list'));
    }

    if (queryMatches(q, ['консульт', 'consult', 'кеңеш'])) {
      var consultStaff = (BOOKING_STAFF[getLang()] || BOOKING_STAFF.ru).consult;
      return Promise.resolve(
        t('ai_services_list') +
          '\n\n' +
          t('booking_lbl_cabinet') +
          ' ' +
          consultStaff.cabinet +
          '\n' +
          t('booking_lbl_employee') +
          ' ' +
          consultStaff.staff
      );
    }

    return Promise.resolve(t('ai_fallback'));
  }

  function renderChat() {
    var box = $('chatMessages');
    if (!box) return;
    box.innerHTML = '';
    chatHistory.forEach(function (m) {
      var div = document.createElement('div');
      div.className = 'chat-bubble chat-bubble--' + (m.role === 'user' ? 'user' : 'bot');
      div.textContent = m.text;
      box.appendChild(div);
    });
    box.scrollTop = box.scrollHeight;
  }

  function ensureChatWelcome() {
    if (chatHistory.length) return;
    chatHistory.push({ role: 'bot', text: t('chat_welcome') });
    renderChat();
  }

  async function sendChat() {
    var input = $('chatInput');
    if (!input) return;
    var text = (input.value || '').trim();
    if (!text) {
      toast(t('toast_enter_question'), 'err');
      return;
    }
    chatHistory.push({ role: 'user', text: text });
    renderChat();
    input.value = '';
    var loading = $('chatLoading');
    var btn = $('chatSend');
    if (loading) loading.hidden = false;
    if (btn) btn.disabled = true;

    try {
      await new Promise(function (resolve) {
        setTimeout(resolve, 400);
      });
      var reply = await consultAi(text);
      chatHistory.push({ role: 'bot', text: reply });
      renderChat();
    } catch (e) {
      console.error(e);
      toast(t('toast_answer_error'), 'err');
    } finally {
      if (loading) loading.hidden = true;
      if (btn) btn.disabled = false;
      input.focus();
    }
  }

  function bindChatChips() {
    document.querySelectorAll('.chip[data-i18n-q]').forEach(function (chip) {
      if (chip.getAttribute('data-ai-bound') === '1') return;
      chip.setAttribute('data-ai-bound', '1');
      chip.addEventListener('click', function () {
        var inp = $('chatInput');
        if (!inp) return;
        inp.value = chip.getAttribute('data-q') || chip.textContent || '';
        sendChat();
      });
    });
  }

  function initChat() {
    var sendBtn = $('chatSend');
    var chatInput = $('chatInput');
    if (!sendBtn || !chatInput) return;
    if (!chatUiBound) {
      sendBtn.addEventListener('click', sendChat);
      chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendChat();
        }
      });
      chatUiBound = true;
    }
    bindChatChips();
  }

  // --- Админ ---

  function refreshAdminGate() {
    var gate = $('adminGate');
    var panel = $('adminPanel');
    if (!gate || !panel) return;
    if (isAdmin()) {
      gate.hidden = true;
      panel.hidden = false;
      renderAdminTable();
    } else {
      gate.hidden = false;
      panel.hidden = true;
    }
  }

  function renderAdminTable() {
    var wrap = $('adminTableWrap');
    var filter = ($('adminFilter') && $('adminFilter').value) || '';
    var apps = loadApplications().filter(function (a) {
      return !filter || a.service === filter;
    });

    if (!apps.length) {
      wrap.innerHTML = '<p class="section__desc">' + escapeHtml(t('admin_empty')) + '</p>';
      return;
    }

    var html =
      '<table class="data-table"><thead><tr><th>' +
      escapeHtml(t('th_id')) +
      '</th><th>' +
      escapeHtml(t('th_name')) +
      '</th><th>' +
      escapeHtml(t('th_service')) +
      '</th><th>' +
      escapeHtml(t('th_cabinet')) +
      '</th><th>' +
      escapeHtml(t('th_specialist')) +
      '</th><th>' +
      escapeHtml(t('th_date')) +
      '</th><th>' +
      escapeHtml(t('th_time')) +
      '</th><th>' +
      escapeHtml(t('th_status')) +
      '</th></tr></thead><tbody>';
    apps.forEach(function (a) {
      html +=
        '<tr><td>' +
        escapeHtml(a.id) +
        '</td><td>' +
        escapeHtml(a.name) +
        '</td><td>' +
        escapeHtml(serviceLabel(a.service)) +
        '</td><td>' +
        escapeHtml(a.cabinet || '—') +
        '</td><td>' +
        escapeHtml(a.staffName || '—') +
        '</td><td>' +
        escapeHtml(a.date) +
        '</td><td>' +
        escapeHtml(a.time) +
        '</td><td><select data-appid="' +
        escapeHtml(a.id) +
        '" class="admin-status">' +
        '<option value="accepted"' +
        (a.status === 'accepted' ? ' selected' : '') +
        '>' +
        escapeHtml(statusLabel('accepted')) +
        '</option>' +
        '<option value="processing"' +
        (a.status === 'processing' ? ' selected' : '') +
        '>' +
        escapeHtml(statusLabel('processing')) +
        '</option>' +
        '<option value="done"' +
        (a.status === 'done' ? ' selected' : '') +
        '>' +
        escapeHtml(statusLabel('done')) +
        '</option>' +
        '</select></td></tr>';
    });
    html += '</tbody></table>';
    wrap.innerHTML = html;

    wrap.querySelectorAll('.admin-status').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var appId = sel.getAttribute('data-appid');
        var newStatus = sel.value;
        var all = loadApplications();
        var i = all.findIndex(function (x) {
          return x.id === appId;
        });
        if (i >= 0) {
          all[i].status = newStatus;
          saveApplications(all);
          toast(t('toast_status_updated'), 'ok');
          refreshStatusQueueIfVisible();
        }
      });
    });
  }

  function initAdmin() {
    $('btnAdminLogin').addEventListener('click', function () {
      var p = $('adminPass').value || '';
      if (p === ADMIN_PASSWORD) {
        setAdmin(true);
        toast(t('toast_admin_ok'), 'ok');
        refreshAdminGate();
      } else {
        toast(t('toast_wrong_pass'), 'err');
      }
    });

    $('btnAdminRefresh').addEventListener('click', function () {
      renderAdminTable();
      toast(t('toast_list_updated'), 'ok');
    });

    $('adminFilter').addEventListener('change', function () {
      renderAdminTable();
    });
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  window.socfondApi = {
    t: t,
    fillBookingCatalogs: fillBookingCatalogs,
    genderFromPin: genderFromPin,
    appGender: appGender,
    officeLabel: officeLabel,
    serviceLabel: serviceLabel,
    showSection: showSection,
    refreshCabinet: refreshCabinet,
    loadApplications: loadApplications,
    getSessionUser: getSessionUser,
    isAdmin: isAdmin,
    renderAdminTable: renderAdminTable,
    refreshAdminGate: refreshAdminGate,
    bindChatChips: bindChatChips,
    consultAi: consultAi,
    getAiSystemPrompt: getAiSystemPrompt,
    toast: toast,
    TRANSLATIONS: TRANSLATIONS,
  };

  document.addEventListener('DOMContentLoaded', function () {
    ensureDemoQueueApplications();
    applyI18n();
    initLangSwitcher();
    initNavigation();
    initMobileNav();
    initCabinet();
    initBookingSuccessModal();
    initBooking();
    initStatus();
    initWizard();
    initChat();
    initAdmin();
  });
})();
