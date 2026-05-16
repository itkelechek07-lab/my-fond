/**
 * portal-ext.js - расширения для «Помощник СоцФонда»
 */
(function () {
  'use strict';

  var DEMO_PIN = '12345678901234';
  var SESSION_PIN = 'socfond_mvp_pin';
  var PENSION_BALANCE = 487250;

  var CONTRIBUTIONS = [
    { date: '2026-04-01', employer: 'ОсОО «ТехноКыргыз»', amount: 4200 },
    { date: '2026-03-01', employer: 'ОсОО «ТехноКыргыз»', amount: 4200 },
    { date: '2026-02-01', employer: 'ОсОО «ТехноКыргыз»', amount: 4100 },
    { date: '2026-01-01', employer: 'ГУП Кыргызпочта', amount: 4100 },
  ];

  var EMPLOYMENT = [
    { employer: 'ОсОО «ТехноКыргыз»', position: 'Инженер-программист', start: '2022-03-15', end: null, years: 4.1 },
    { employer: 'ГУП Кыргызпочта', position: 'Специалист', start: '2018-06-01', end: '2022-02-28', years: 3.7 },
    { employer: 'ИП «Абдыкалыков»', position: 'Бухгалтер', start: '2015-01-10', end: '2018-05-20', years: 3.4 },
  ];

  var NOTIFICATIONS = [
    { title: 'Заявление в обработке', msg: 'Ваше заявление принято в работу.', channel: 'sms', date: '2026-05-14', read: false },
    { title: 'Напоминание о визите', msg: 'Завтра в 10:30 — визит. Талон A-047.', channel: 'email', date: '2026-05-19', read: false },
    { title: 'Справка готова', msg: 'Документ в личном кабинете.', channel: 'email', date: '2026-04-25', read: true },
  ];

  var EXTRA_I18N = {
    ru: {
      nav_calculator: 'Калькулятор', btn_calculator: 'Калькулятор пенсии',
      mini_savings_h: 'Пенсионные накопления', mini_savings_p: 'Баланс в кабинете.', mini_savings_btn: 'Открыть →',
      mini_experience_h: 'Трудовой стаж', mini_experience_p: 'Периоды работы.', mini_experience_btn: 'Открыть →',
      login_pin_lbl: 'ПИН (14 цифр)', login_pin_ph: '12345678901234', login_pin_hint: 'Демо-ПИН: 12345678901234',
      ctab_apps: 'Заявления', ctab_savings: 'Накопления', ctab_experience: 'Стаж', ctab_notifications: 'Уведомления',
      btn_new_app: '+ Новое заявление', savings_title: 'Пенсионные накопления', experience_title: 'Трудовой стаж', notifications_title: 'Уведомления',
      widget_savings: 'Накопления', widget_experience: 'Стаж', widget_apps: 'Заявления', widget_notify: 'Новые',
      savings_balance: 'Баланс', savings_updated: 'Обновлено: 1 мая 2026',
      th_contrib_date: 'Дата', th_contrib_emp: 'Работодатель', th_contrib_sum: 'Сумма',
      exp_total: 'Общий стаж', exp_years: 'лет', exp_present: 'по настоящее время',
      notify_settings: 'Каналы', notify_sms: 'SMS', notify_email: 'Email', savings_need_pin: 'Войдите с демо-ПИН.',
      calc_title: 'Калькулятор пенсии',
      calc_desc:
        'Предварительный расчёт размера пенсии (демо-формула). Укажите данные или подставьте стаж из личного кабинета.',
      calc_params: 'Параметры расчёта',
      calc_type: 'Тип пенсии',
      calc_type_age: 'По возрасту',
      calc_type_disability: 'По инвалидности',
      calc_type_survivor: 'По потере кормильца',
      calc_type_social: 'Социальная',
      calc_gender: 'Пол (для возраста выхода)',
      calc_gender_m: 'Мужской',
      calc_gender_f: 'Женский',
      calc_age: 'Возраст (лет)',
      calc_exp: 'Стаж (лет)',
      calc_exp_months: 'Стаж (мес.)',
      calc_salary: 'Средняя зарплата (сом/мес.)',
      calc_savings_chk: 'Учесть пенсионные накопления',
      calc_savings_hint: 'Доступно после входа с демо-ПИН в кабинете.',
      calc_btn: 'Рассчитать',
      calc_fill: 'Из кабинета',
      calc_reset: 'Сбросить',
      calc_book: 'Записаться на оформление',
      calc_result_lbl: 'Предварительная пенсия в месяц',
      calc_result_year: 'В год (×12)',
      calc_note: 'Точная сумма определяется при назначении в Соцфонде. Формула учебная.',
      calc_breakdown_title: 'Состав расчёта',
      calc_bd_base: 'Базовая часть (55% × зарплата × коэф. стажа)',
      calc_bd_exp: 'Коэффициент стажа',
      calc_bd_age: 'Надбавка за достижение пенсионного возраста',
      calc_bd_savings: 'Доля накоплений (демо)',
      calc_bd_min: 'Минимальная пенсия (порог)',
      calc_eligible_yes: 'По введённым данным вы можете подать заявление (демо-проверка).',
      calc_eligible_no: 'Недостаточно стажа или возраста для пенсии по возрасту (мин. {minExp} лет стажа, возраст {retireAge}).',
      calc_eligible_warn: 'До пенсионного возраста ещё {years} лет. Расчёт показан заранее.',
      calc_retire_now: 'Пенсионный возраст достигнут.',
      calc_retire_age: 'Пенсионный возраст (демо): {age} лет',
      calc_how_title: 'Как пользоваться',
      calc_how_1: 'Выберите тип пенсии и заполните поля.',
      calc_how_2: '«Из кабинета» подставит стаж из раздела «Стаж» (нужен демо-ПИН).',
      calc_how_3: 'После расчёта можно записаться на приём в один клик.',
      calc_filled_ok: 'Данные подставлены из кабинета',
      calc_filled_no_pin: 'Войдите в кабинет с демо-ПИН, чтобы подставить стаж',
      calc_coeff: 'коэф.',
      calc_exp_short: 'стаж',
      admin_tab_apps: 'Заявления', admin_tab_queue: 'Очередь', admin_tab_citizens: 'Граждане', admin_tab_reports: 'Отчёты',
      admin_call_next: 'Вызвать следующего', admin_now_calling: 'Вызывается', admin_queue_today: 'Очередь',
      admin_served: 'Обслужен', admin_waiting: 'Ожидает',
      admin_reports_title: 'Сводка по обслуживанию',
      admin_reports_desc: 'Статистика по заявкам в системе (данные из браузера + демо-сводка филиала).',
      admin_reports_period: 'Период',
      admin_reports_period_all: 'Всё время',
      admin_reports_period_month: 'Текущий месяц',
      admin_reports_period_year: '2026 год',
      admin_reports_total: 'Всего обращений',
      admin_reports_done: 'Завершено',
      admin_reports_processing: 'В обработке',
      admin_reports_accepted: 'Принято',
      admin_reports_male: 'Мужчин',
      admin_reports_female: 'Женщин',
      admin_reports_male_done: 'Мужчин обслужено',
      admin_reports_female_done: 'Женщин обслужено',
      admin_reports_online: 'Онлайн-заявки',
      admin_reports_office: 'Личный приём',
      admin_reports_actions_title: 'Виды действий',
      admin_reports_gender_title: 'Пол заявителей',
      admin_reports_region_title: 'По регионам / отделениям',
      admin_reports_service_title: 'По услугам',
      admin_reports_chart_title: 'Динамика обращений',
      admin_reports_empty: 'Заявок за выбранный период нет. Создайте записи в разделе «Подать заявку».',
      admin_reports_demo_note: 'Ниже — демо-сводка типичного филиала Соцфонда (для наглядности).',
      admin_reports_your_data: 'По вашим заявкам в браузере',
      admin_reports_col_action: 'Действие / услуга',
      admin_reports_col_count: 'Кол-во',
      admin_reports_col_done: 'Завершено',
      admin_reports_col_region: 'Регион',
      admin_reports_col_m: 'М',
      admin_reports_col_f: 'Ж',
      admin_reports_col_total: 'Всего',
      admin_reports_act_pension: 'Оформление / перерасчёт пенсии',
      admin_reports_act_benefit: 'Назначение пособий',
      admin_reports_act_certificate: 'Выдача справок',
      admin_reports_act_consult: 'Консультации',
      admin_reports_act_other: 'Прочие услуги',
      admin_reports_act_booking: 'Запись на приём',
      admin_reports_pct: '{n}%',
      admin_reports_gender_unknown: 'Не определён',
      admin_reports_download_pdf: 'Скачать PDF',
      admin_reports_pdf_generating: 'Формирование PDF…',
      admin_reports_pdf_ok: 'Отчёт сохранён в PDF',
      admin_reports_pdf_error: 'Не удалось создать PDF. Обновите страницу и попробуйте снова.',
      admin_reports_pdf_doc_title: 'Отчёт по обслуживанию — Соцфонд КР',
      admin_reports_pdf_generated: 'Дата формирования',
      admin_reports_pdf_period: 'Период отчёта',
      admin_reports_pdf_section_kpi: 'Основные показатели',
      admin_reports_pdf_section_gender: 'Пол заявителей',
      admin_reports_pdf_section_actions: 'Виды действий',
      admin_reports_pdf_footer: 'Учебный демо-отчёт. Данные из браузера (LocalStorage).',
      admin_chart_title: 'По месяцам',
      modal_ticket: 'Талон', modal_qr_hint: 'QR для входа (демо).', chip_q4: 'Пенсионные накопления', chip_q5: 'Трудовой стаж',
    },
    ky: {
      nav_calculator: 'Калькулятор', btn_calculator: 'Пенсия калькулятору',
      mini_savings_h: 'Жыйноолор', mini_savings_p: 'Кабинетте.', mini_savings_btn: 'Ачуу →',
      mini_experience_h: 'Стаж', mini_experience_p: 'Иш мезгилдери.', mini_experience_btn: 'Ачуу →',
      login_pin_lbl: 'ПИН', login_pin_ph: '12345678901234', login_pin_hint: 'Демо-ПИН: 12345678901234',
      ctab_apps: 'Арыздар', ctab_savings: 'Жыйноолор', ctab_experience: 'Стаж', ctab_notifications: 'Эскертме',
      btn_new_app: '+ Арыз', savings_title: 'Жыйноолор', experience_title: 'Стаж', notifications_title: 'Эскертмелер',
      widget_savings: 'Жыйноо', widget_experience: 'Стаж', widget_apps: 'Арыз', widget_notify: 'Жаңы',
      savings_balance: 'Баланс', savings_updated: 'Жаңыланды', th_contrib_date: 'Күнү', th_contrib_emp: 'Иш берүүчү', th_contrib_sum: 'Сумма',
      exp_total: 'Жалпы стаж', exp_years: 'жыл', exp_present: 'азыр', notify_settings: 'Каналдар', notify_sms: 'SMS', notify_email: 'Email',
      savings_need_pin: 'Демо-ПИН керек.',
      calc_title: 'Пенсия калькулятору',
      calc_desc: 'Пенсиянын болжолдуу өлчөмү (демо-формула). Маалыматты киргизиңиз же кабинеттен стажды алыңыз.',
      calc_params: 'Эсептөө параметрлери',
      calc_type: 'Пенсия түрү',
      calc_type_age: 'Жаш боюнча',
      calc_type_disability: 'Майыптык боюнча',
      calc_type_survivor: 'Тарбалоочуну жоготуу',
      calc_type_social: 'Социалдык',
      calc_gender: 'Жынысы (чыгуу жашы үчүн)',
      calc_gender_m: 'Эркек',
      calc_gender_f: 'Аял',
      calc_age: 'Жаш (жыл)',
      calc_exp: 'Стаж (жыл)',
      calc_exp_months: 'Стаж (ай)',
      calc_salary: 'Орточо айлык (сом/ай)',
      calc_savings_chk: 'Пенсиялык жыйноолорду эсепке алуу',
      calc_savings_hint: 'Демо-ПИН менен кабинетке киргенден кийин.',
      calc_btn: 'Эсептөө',
      calc_fill: 'Кабинеттен',
      calc_reset: 'Тазалоо',
      calc_book: 'Катталуу',
      calc_result_lbl: 'Айына болжолдуу пенсия',
      calc_result_year: 'Жылына (×12)',
      calc_note: 'Так сумма Соцфонддо ыйгарылат. Формула окуу максатында.',
      calc_breakdown_title: 'Эсептин түзүлүшү',
      calc_bd_base: 'Негизги бөлүк (55% × айлык × стаж коэф.)',
      calc_bd_exp: 'Стаж коэффициенти',
      calc_bd_age: 'Пенсиялык жашка жеткенде кошумча',
      calc_bd_savings: 'Жыйноолордун үлүшү (демо)',
      calc_bd_min: 'Минималдуу пенсия',
      calc_eligible_yes: 'Киргизилген маалымат боюнча арыз берсеңиз болот (демо).',
      calc_eligible_no: 'Жаш же стаж жетишсиз (мин. {minExp} жыл, чыгуу жашы {retireAge}).',
      calc_eligible_warn: 'Пенсиялык жашка {years} жыл калды. Эсеп алдын ала көрсөтүлдү.',
      calc_retire_now: 'Пенсиялык жашка жеттиңиз.',
      calc_retire_age: 'Пенсиялык жаш (демо): {age} жыл',
      calc_how_title: 'Кантип колдонуу',
      calc_how_1: 'Пенсия түрүн тандап, талааларды толтуруңуз.',
      calc_how_2: '«Кабинеттен» — «Стаж» бөлүмүнөн (демо-ПИН керек).',
      calc_how_3: 'Эсептөөдөн кийин бир баскыч менен каттала аласыз.',
      calc_filled_ok: 'Кабинеттен маалымат алынды',
      calc_filled_no_pin: 'Стаж үчүн демо-ПИН менен кириңиз',
      calc_coeff: 'коэф.',
      calc_exp_short: 'стаж',
      admin_tab_apps: 'Арыздар', admin_tab_queue: 'Кезек', admin_tab_citizens: 'Жарандар', admin_tab_reports: 'Отчёт',
      admin_call_next: 'Кийинки', admin_now_calling: 'Чакырылууда', admin_queue_today: 'Кезек', admin_served: 'Даяр', admin_waiting: 'Күтүү',
      admin_reports_title: 'Кызмат көрсөтүү боюнча жыйынтык',
      admin_reports_desc: 'Системадагы арыздар (браузер + демо-бөлүм).',
      admin_reports_period: 'Мезгил',
      admin_reports_period_all: 'Баары',
      admin_reports_period_month: 'Учурдагы ай',
      admin_reports_period_year: '2026-жыл',
      admin_reports_total: 'Жалпы кайрылуулар',
      admin_reports_done: 'Аякталды',
      admin_reports_processing: 'Иштетилүүдө',
      admin_reports_accepted: 'Кабыл алынды',
      admin_reports_male: 'Эркектер',
      admin_reports_female: 'Аялдар',
      admin_reports_male_done: 'Эркектер кызмат алды',
      admin_reports_female_done: 'Аялдар кызмат алды',
      admin_reports_online: 'Онлайн арыздар',
      admin_reports_office: 'Жеке кабыл алуу',
      admin_reports_actions_title: 'Аракеттердин түрлөрү',
      admin_reports_gender_title: 'Жынысы',
      admin_reports_region_title: 'Аймактар боюнча',
      admin_reports_service_title: 'Кызматтар боюнча',
      admin_reports_chart_title: 'Динамика',
      admin_reports_empty: 'Арыз жок. «Жазылуу» бөлүмүнөн түзүңүз.',
      admin_reports_demo_note: 'Төмөндө — демо-бөлүмдүн мисалы.',
      admin_reports_your_data: 'Сиздин арыздар',
      admin_reports_col_action: 'Аракет / кызмат',
      admin_reports_col_count: 'Саны',
      admin_reports_col_done: 'Даяр',
      admin_reports_col_region: 'Аймак',
      admin_reports_col_m: 'Э',
      admin_reports_col_f: 'А',
      admin_reports_col_total: 'Жалпы',
      admin_reports_act_pension: 'Пенсия',
      admin_reports_act_benefit: 'Жөлөмдөр',
      admin_reports_act_certificate: 'Маалыматтар',
      admin_reports_act_consult: 'Кеңештер',
      admin_reports_act_other: 'Башка',
      admin_reports_act_booking: 'Жазылуу',
      admin_reports_pct: '{n}%',
      admin_reports_gender_unknown: 'Аныкталган жок',
      admin_reports_download_pdf: 'PDF жүктөө',
      admin_reports_pdf_generating: 'PDF түзүлүүдө…',
      admin_reports_pdf_ok: 'PDF сакталды',
      admin_reports_pdf_error: 'PDF түзүлбөй калды.',
      admin_reports_pdf_doc_title: 'Кызмат көрсөтүү отчёту — Соцфонд КР',
      admin_reports_pdf_generated: 'Түзүлгөн күнү',
      admin_reports_pdf_period: 'Отчёт мезгили',
      admin_reports_pdf_section_kpi: 'Негизги көрсөткүчтөр',
      admin_reports_pdf_section_gender: 'Жынысы',
      admin_reports_pdf_section_actions: 'Аракеттер',
      admin_reports_pdf_footer: 'Окуу демо-отчёт. Браузер маалыматтары.',
      admin_chart_title: 'Айлар',
      modal_ticket: 'Талон', modal_qr_hint: 'QR (демо).', chip_q4: 'Жыйноолор', chip_q5: 'Стаж',
    },
    en: {
      nav_calculator: 'Calculator', btn_calculator: 'Pension calculator',
      mini_savings_h: 'Savings', mini_savings_p: 'In your account.', mini_savings_btn: 'Open →',
      mini_experience_h: 'Work history', mini_experience_p: 'Employment periods.', mini_experience_btn: 'Open →',
      login_pin_lbl: 'PIN (14 digits)', login_pin_ph: '12345678901234', login_pin_hint: 'Demo PIN: 12345678901234',
      ctab_apps: 'Applications', ctab_savings: 'Savings', ctab_experience: 'Experience', ctab_notifications: 'Alerts',
      btn_new_app: '+ New app', savings_title: 'Pension savings', experience_title: 'Work history', notifications_title: 'Notifications',
      widget_savings: 'Savings', widget_experience: 'Experience', widget_apps: 'Apps', widget_notify: 'New',
      savings_balance: 'Balance', savings_updated: 'Updated May 2026', th_contrib_date: 'Date', th_contrib_emp: 'Employer', th_contrib_sum: 'Amount',
      exp_total: 'Total', exp_years: 'yrs', exp_present: 'present', notify_settings: 'Channels', notify_sms: 'SMS', notify_email: 'Email',
      savings_need_pin: 'Use demo PIN.',
      calc_title: 'Pension calculator',
      calc_desc: 'Estimated pension amount (demo formula). Enter your data or pull experience from your account.',
      calc_params: 'Calculation parameters',
      calc_type: 'Pension type',
      calc_type_age: 'By age',
      calc_type_disability: 'Disability',
      calc_type_survivor: "Survivor's",
      calc_type_social: 'Social',
      calc_gender: 'Gender (retirement age)',
      calc_gender_m: 'Male',
      calc_gender_f: 'Female',
      calc_age: 'Age (years)',
      calc_exp: 'Experience (years)',
      calc_exp_months: 'Experience (months)',
      calc_salary: 'Average salary (KGS/month)',
      calc_savings_chk: 'Include pension savings',
      calc_savings_hint: 'Available after signing in with demo PIN.',
      calc_btn: 'Calculate',
      calc_fill: 'From account',
      calc_reset: 'Reset',
      calc_book: 'Book appointment',
      calc_result_lbl: 'Estimated monthly pension',
      calc_result_year: 'Per year (×12)',
      calc_note: 'Final amount is set by the Social Fund. Formula is for demo only.',
      calc_breakdown_title: 'Breakdown',
      calc_bd_base: 'Base part (55% × salary × experience factor)',
      calc_bd_exp: 'Experience factor',
      calc_bd_age: 'Age bonus',
      calc_bd_savings: 'Savings share (demo)',
      calc_bd_min: 'Minimum pension floor',
      calc_eligible_yes: 'Based on your input, you may apply (demo check).',
      calc_eligible_no: 'Not enough experience or age (min. {minExp} yrs, retirement age {retireAge}).',
      calc_eligible_warn: '{years} years until retirement age. Estimate shown in advance.',
      calc_retire_now: 'Retirement age reached.',
      calc_retire_age: 'Retirement age (demo): {age}',
      calc_how_title: 'How to use',
      calc_how_1: 'Choose pension type and fill in the fields.',
      calc_how_2: '“From account” fills experience from Work history (demo PIN required).',
      calc_how_3: 'After calculation, book an appointment in one click.',
      calc_filled_ok: 'Data filled from account',
      calc_filled_no_pin: 'Sign in with demo PIN to fill experience',
      calc_coeff: 'factor',
      calc_exp_short: 'exp.',
      admin_tab_apps: 'Apps', admin_tab_queue: 'Queue', admin_tab_citizens: 'Citizens', admin_tab_reports: 'Reports',
      admin_call_next: 'Call next', admin_now_calling: 'Calling', admin_queue_today: 'Queue', admin_served: 'Done', admin_waiting: 'Waiting',
      admin_reports_title: 'Service summary',
      admin_reports_desc: 'Statistics from applications in this browser (+ demo branch summary).',
      admin_reports_period: 'Period',
      admin_reports_period_all: 'All time',
      admin_reports_period_month: 'This month',
      admin_reports_period_year: 'Year 2026',
      admin_reports_total: 'Total visits',
      admin_reports_done: 'Completed',
      admin_reports_processing: 'In progress',
      admin_reports_accepted: 'Accepted',
      admin_reports_male: 'Male',
      admin_reports_female: 'Female',
      admin_reports_male_done: 'Males served',
      admin_reports_female_done: 'Females served',
      admin_reports_online: 'Online applications',
      admin_reports_office: 'In-person',
      admin_reports_actions_title: 'Types of actions',
      admin_reports_gender_title: 'Applicants by gender',
      admin_reports_region_title: 'By region',
      admin_reports_service_title: 'By service',
      admin_reports_chart_title: 'Trend',
      admin_reports_empty: 'No applications for this period. Create one in Booking.',
      admin_reports_demo_note: 'Demo summary of a typical Social Fund branch below.',
      admin_reports_your_data: 'Your applications in this browser',
      admin_reports_col_action: 'Action / service',
      admin_reports_col_count: 'Count',
      admin_reports_col_done: 'Done',
      admin_reports_col_region: 'Region',
      admin_reports_col_m: 'M',
      admin_reports_col_f: 'F',
      admin_reports_col_total: 'Total',
      admin_reports_act_pension: 'Pension services',
      admin_reports_act_benefit: 'Benefits',
      admin_reports_act_certificate: 'Certificates',
      admin_reports_act_consult: 'Consultations',
      admin_reports_act_other: 'Other services',
      admin_reports_act_booking: 'Appointments booked',
      admin_reports_pct: '{n}%',
      admin_reports_gender_unknown: 'Unknown',
      admin_reports_download_pdf: 'Download PDF',
      admin_reports_pdf_generating: 'Generating PDF…',
      admin_reports_pdf_ok: 'Report saved as PDF',
      admin_reports_pdf_error: 'Could not create PDF. Refresh and try again.',
      admin_reports_pdf_doc_title: 'Service report — Social Fund KR',
      admin_reports_pdf_generated: 'Generated on',
      admin_reports_pdf_period: 'Report period',
      admin_reports_pdf_section_kpi: 'Key indicators',
      admin_reports_pdf_section_gender: 'Gender',
      admin_reports_pdf_section_actions: 'Actions',
      admin_reports_pdf_footer: 'Educational demo report. Browser data (LocalStorage).',
      admin_chart_title: 'By month',
      modal_ticket: 'Ticket', modal_qr_hint: 'QR at entrance (demo).', chip_q4: 'Pension savings', chip_q5: 'Work history',
    },
  };

  var adminQueue = [
    { ticket: 'A-045', name: 'Исакова А.М.', time: '09:00', status: 'done' },
    { ticket: 'A-046', name: 'Токтогулов Н.Б.', time: '09:30', status: 'done' },
    { ticket: 'A-047', name: 'Абдыкалыков Б.Т.', time: '10:30', status: 'waiting' },
    { ticket: 'A-048', name: 'Садыкова Г.К.', time: '11:00', status: 'waiting' },
  ];
  var adminCurrent = 'A-047';
  var adminReportPeriod = 'all';

  /** Демо-сводка филиала (когда мало заявок в браузере) */
  var DEMO_BRANCH_REPORT = {
    total: 1847,
    byStatus: { accepted: 124, processing: 198, done: 1525 },
    gender: { m: 812, f: 1012, u: 23 },
    genderDone: { m: 678, f: 832, u: 15 },
    online: 1264,
    walkIn: 583,
    byRegion: {
      region_bishkek: { total: 612, m: 278, f: 332, done: 498 },
      region_chuy: { total: 198, m: 89, f: 108, done: 162 },
      region_osh_city: { total: 341, m: 156, f: 184, done: 289 },
      region_osh: { total: 156, m: 72, f: 83, done: 128 },
      region_jalal: { total: 224, m: 98, f: 125, done: 186 },
      region_naryn: { total: 87, m: 41, f: 46, done: 71 },
      region_issyk_kul: { total: 132, m: 58, f: 73, done: 108 },
      region_talas: { total: 54, m: 25, f: 29, done: 44 },
      region_batken: { total: 43, m: 19, f: 24, done: 39 },
    },
    byMonth: { '2026-01': 312, '2026-02': 358, '2026-03': 401, '2026-04': 428, '2026-05': 348 },
    actions: {
      pension: 524,
      benefit: 612,
      certificate: 389,
      consult: 198,
      other: 124,
    },
  };

  var CALC_STORAGE = 'socfond_mvp_calc';
  var CALC_MIN_EXP = 15;
  var CALC_FULL_EXP = 25;
  var CALC_RETIRE_M = 63;
  var CALC_RETIRE_F = 58;
  var CALC_MIN_PENSION = 2500;

  function api() { return window.socfondApi || {}; }
  function $(id) { return document.getElementById(id); }

  function getLang() {
    try {
      var v = localStorage.getItem('socfond_mvp_lang');
      if (v === 'ru' || v === 'ky' || v === 'en') return v;
    } catch (e) {}
    return 'ru';
  }

  function te(key) {
    var a = api();
    if (a.t) {
      var v = a.t(key);
      if (v && v !== key) return v;
    }
    var map = EXTRA_I18N[getLang()] || EXTRA_I18N.ru;
    return map[key] || EXTRA_I18N.ru[key] || key;
  }

  function teFmt(key, vars) {
    var s = te(key);
    if (!vars) return s;
    Object.keys(vars).forEach(function (k) {
      s = s.split('{' + k + '}').join(String(vars[k]));
    });
    return s;
  }

  function mergeI18n() {
    var a = api();
    if (!a.TRANSLATIONS) return;
    ['ru', 'ky', 'en'].forEach(function (lang) {
      Object.assign(a.TRANSLATIONS[lang], EXTRA_I18N[lang]);
    });
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function money(n) {
    return new Intl.NumberFormat('ru-KG', { style: 'currency', currency: 'KGS', maximumFractionDigits: 0 }).format(n);
  }

  function getPin() {
    try { return sessionStorage.getItem(SESSION_PIN) || ''; } catch (e) { return ''; }
  }

  function setPin(pin) {
    try {
      if (pin) sessionStorage.setItem(SESSION_PIN, pin);
      else sessionStorage.removeItem(SESSION_PIN);
    } catch (e) {}
  }

  function hasDemo() { return getPin() === DEMO_PIN; }

  function applyExtraI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (EXTRA_I18N.ru[k]) el.textContent = te(k);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-placeholder');
      if (EXTRA_I18N.ru[k]) el.setAttribute('placeholder', te(k));
    });
    document.querySelectorAll('[data-i18n-q]').forEach(function (chip) {
      var k = chip.getAttribute('data-i18n-q');
      if (EXTRA_I18N.ru[k]) {
        chip.textContent = te(k);
        chip.setAttribute('data-q', te(k));
      }
    });
    document.querySelectorAll('[data-i18n-option]').forEach(function (opt) {
      var k = opt.getAttribute('data-i18n-option');
      if (EXTRA_I18N.ru[k]) opt.textContent = te(k);
    });
    var savingsHint = $('calcSavingsHint');
    if (savingsHint) savingsHint.textContent = te('calc_savings_hint');
  }

  function getTotalExperienceYears() {
    return EMPLOYMENT.reduce(function (s, r) {
      return s + r.years;
    }, 0);
  }

  function readCalcForm() {
    var gender = ($('calcGender') && $('calcGender').value) || 'm';
    var expYears = +($('calcExp') && $('calcExp').value) || 0;
    var expMonths = +($('calcExpMonths') && $('calcExpMonths').value) || 0;
    return {
      type: ($('calcType') && $('calcType').value) || 'age',
      gender: gender,
      age: +($('calcAge') && $('calcAge').value) || 58,
      expYears: expYears,
      expMonths: Math.min(11, Math.max(0, expMonths)),
      expTotal: expYears + Math.min(11, Math.max(0, expMonths)) / 12,
      salary: +($('calcSalary') && $('calcSalary').value) || 35000,
      includeSavings: !!($('calcSavings') && $('calcSavings').checked),
    };
  }

  function computePension(input) {
    var retireAge = input.gender === 'f' ? CALC_RETIRE_F : CALC_RETIRE_M;
    var expCoef = Math.min(input.expTotal / CALC_FULL_EXP, 1);
    var basePart = 0;
    var ageBonus = 0;
    var savingsPart = 0;
    var typeFactor = 1;

    if (input.type === 'disability') {
      basePart = input.salary * 0.45 * expCoef;
      typeFactor = 0.45;
    } else if (input.type === 'survivor') {
      basePart = input.salary * 0.35;
      expCoef = 1;
      typeFactor = 0.35;
    } else if (input.type === 'social') {
      basePart = CALC_MIN_PENSION * 1.4;
      expCoef = 1;
    } else {
      basePart = input.salary * 0.55 * expCoef;
      if (input.age >= retireAge) ageBonus = basePart * 0.05;
    }

    if (input.includeSavings && hasDemo()) {
      savingsPart = Math.round(PENSION_BALANCE * 0.0008);
    }

    var raw = Math.round(basePart + ageBonus + savingsPart);
    var total = Math.max(raw, CALC_MIN_PENSION);
    var yearsToRetire = Math.max(0, retireAge - input.age);
    var eligible =
      input.type !== 'age' ||
      (input.expTotal >= CALC_MIN_EXP && input.age >= retireAge - 5);

    return {
      total: total,
      yearly: total * 12,
      retireAge: retireAge,
      yearsToRetire: yearsToRetire,
      eligible: eligible,
      expCoef: expCoef,
      breakdown: {
        basePart: Math.round(basePart),
        ageBonus: Math.round(ageBonus),
        savingsPart: savingsPart,
        minApplied: raw < CALC_MIN_PENSION,
        typeFactor: typeFactor,
      },
    };
  }

  function saveCalcForm() {
    try {
      var f = readCalcForm();
      localStorage.setItem(
        CALC_STORAGE,
        JSON.stringify({
          type: f.type,
          gender: f.gender,
          age: f.age,
          expYears: f.expYears,
          expMonths: f.expMonths,
          salary: f.salary,
          includeSavings: f.includeSavings,
        })
      );
    } catch (e) {}
  }

  function loadCalcForm() {
    try {
      var raw = localStorage.getItem(CALC_STORAGE);
      if (!raw) return;
      var d = JSON.parse(raw);
      if ($('calcType') && d.type) $('calcType').value = d.type;
      if ($('calcGender') && d.gender) $('calcGender').value = d.gender;
      if ($('calcAge') && d.age != null) $('calcAge').value = d.age;
      if ($('calcExp') && d.expYears != null) $('calcExp').value = d.expYears;
      if ($('calcExpMonths') && d.expMonths != null) $('calcExpMonths').value = d.expMonths;
      if ($('calcSalary') && d.salary != null) $('calcSalary').value = d.salary;
      if ($('calcSavings') && d.includeSavings != null) $('calcSavings').checked = !!d.includeSavings;
    } catch (e) {}
  }

  function renderCalcResult(result, input) {
    var res = $('calcResult');
    if (!res) return;

    var statusClass = result.eligible ? 'calc-status--ok' : 'calc-status--warn';
    var statusText = result.eligible
      ? te('calc_eligible_yes')
      : teFmt('calc_eligible_no', { minExp: CALC_MIN_EXP, retireAge: result.retireAge });

    if (input.type === 'age' && result.yearsToRetire > 0 && input.expTotal >= CALC_MIN_EXP) {
      statusClass = 'calc-status--info';
      statusText = teFmt('calc_eligible_warn', { years: result.yearsToRetire });
    }
    if (input.type === 'age' && result.yearsToRetire === 0 && input.age >= result.retireAge) {
      statusText = te('calc_retire_now') + ' ' + te('calc_eligible_yes');
      statusClass = 'calc-status--ok';
    }

    var retireLine =
      result.yearsToRetire > 0
        ? teFmt('calc_eligible_warn', { years: result.yearsToRetire })
        : te('calc_retire_now');

    res.hidden = false;
    res.className = 'calc-result card';
    res.innerHTML =
      '<div class="calc-status ' +
      statusClass +
      '">' +
      esc(statusText) +
      '</div>' +
      '<p class="calc-result__label">' +
      esc(te('calc_result_lbl')) +
      '</p>' +
      '<p class="calc-result__sum">' +
      money(result.total) +
      '</p>' +
      '<p class="calc-result__year">' +
      esc(te('calc_result_year')) +
      ': <strong>' +
      money(result.yearly) +
      '</strong></p>' +
      '<p class="calc-result__retire">' +
      esc(teFmt('calc_retire_age', { age: result.retireAge })) +
      ' · ' +
      esc(retireLine) +
      '</p>' +
      '<div class="calc-breakdown">' +
      '<h3 class="calc-breakdown__title">' +
      esc(te('calc_breakdown_title')) +
      '</h3>' +
      '<dl class="calc-breakdown__list">' +
      '<dt>' +
      esc(te('calc_bd_exp')) +
      '</dt><dd>' +
      result.expCoef.toFixed(2) +
      ' (' +
      input.expTotal.toFixed(1) +
      ' ' +
      te('calc_exp_short') +
      ')</dd>' +
      '<dt>' +
      esc(te('calc_bd_base')) +
      '</dt><dd>' +
      money(result.breakdown.basePart) +
      '</dd>' +
      (result.breakdown.ageBonus
        ? '<dt>' + esc(te('calc_bd_age')) + '</dt><dd>' + money(result.breakdown.ageBonus) + '</dd>'
        : '') +
      (result.breakdown.savingsPart
        ? '<dt>' + esc(te('calc_bd_savings')) + '</dt><dd>' + money(result.breakdown.savingsPart) + '</dd>'
        : '') +
      (result.breakdown.minApplied
        ? '<dt>' + esc(te('calc_bd_min')) + '</dt><dd>' + money(CALC_MIN_PENSION) + '</dd>'
        : '') +
      '</dl></div>' +
      '<p class="calc-result__note">' +
      esc(te('calc_note')) +
      '</p>' +
      '<button type="button" class="btn btn--outline" id="calcBookBtn">' +
      esc(te('calc_book')) +
      '</button>';

    var bookBtn = $('calcBookBtn');
    if (bookBtn) {
      bookBtn.addEventListener('click', function () {
        if (api().showSection) {
          api().showSection('booking');
          var svc = $('bfService');
          if (svc) {
            svc.value = 'pension';
            svc.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });
    }
  }

  function fillCalcFromCabinet() {
    var total = getTotalExperienceYears();
    var years = Math.floor(total);
    var months = Math.round((total - years) * 12);
    if ($('calcExp')) $('calcExp').value = years;
    if ($('calcExpMonths')) $('calcExpMonths').value = months;
    if ($('calcSavings') && hasDemo()) $('calcSavings').checked = true;
    if (api().toast) {
      api().toast(hasDemo() ? te('calc_filled_ok') : te('calc_filled_no_pin'), hasDemo() ? 'ok' : 'info');
    }
  }

  function resetCalcForm() {
    if ($('calcType')) $('calcType').value = 'age';
    if ($('calcGender')) $('calcGender').value = 'm';
    if ($('calcAge')) $('calcAge').value = 58;
    if ($('calcExp')) $('calcExp').value = 25;
    if ($('calcExpMonths')) $('calcExpMonths').value = 0;
    if ($('calcSalary')) $('calcSalary').value = 35000;
    if ($('calcSavings')) $('calcSavings').checked = false;
    var res = $('calcResult');
    if (res) res.hidden = true;
    try {
      localStorage.removeItem(CALC_STORAGE);
    } catch (e) {}
  }

  function runCalc() {
    var input = readCalcForm();
    var result = computePension(input);
    saveCalcForm();
    renderCalcResult(result, input);
  }

  function injectCalculator() {
    var existing = $('calculator');
    if (existing && !$('calcType')) existing.remove();

    if ($('calculator')) return;

    if (!$('booking')) return;

    var sec = document.createElement('section');
    sec.id = 'calculator';
    sec.className = 'section';
    sec.hidden = true;
    sec.innerHTML =
      '<div class="container">' +
      '<h2><i class="fa-solid fa-calculator" aria-hidden="true"></i> <span data-i18n="calc_title"></span></h2>' +
      '<p class="section__desc" data-i18n="calc_desc"></p>' +
      '<div class="calc-layout">' +
      '<form id="calcForm" class="card calc-form" novalidate>' +
      '<h3 class="calc-form__heading" data-i18n="calc_params"></h3>' +
      '<label class="label" for="calcType" data-i18n="calc_type"></label>' +
      '<select id="calcType" class="input">' +
      '<option value="age" data-i18n-option="calc_type_age"></option>' +
      '<option value="disability" data-i18n-option="calc_type_disability"></option>' +
      '<option value="survivor" data-i18n-option="calc_type_survivor"></option>' +
      '<option value="social" data-i18n-option="calc_type_social"></option>' +
      '</select>' +
      '<label class="label" for="calcGender" data-i18n="calc_gender"></label>' +
      '<select id="calcGender" class="input">' +
      '<option value="m" data-i18n-option="calc_gender_m"></option>' +
      '<option value="f" data-i18n-option="calc_gender_f"></option>' +
      '</select>' +
      '<div class="calc-form__row">' +
      '<div><label class="label" for="calcAge" data-i18n="calc_age"></label>' +
      '<input type="number" id="calcAge" class="input" value="58" min="18" max="80" /></div>' +
      '<div><label class="label" for="calcExp" data-i18n="calc_exp"></label>' +
      '<input type="number" id="calcExp" class="input" value="25" min="0" max="50" step="0.5" /></div>' +
      '</div>' +
      '<label class="label" for="calcExpMonths" data-i18n="calc_exp_months"></label>' +
      '<input type="number" id="calcExpMonths" class="input" value="0" min="0" max="11" />' +
      '<label class="label" for="calcSalary" data-i18n="calc_salary"></label>' +
      '<input type="number" id="calcSalary" class="input" value="35000" min="5000" step="500" />' +
      '<label class="calc-check"><input type="checkbox" id="calcSavings" /> <span data-i18n="calc_savings_chk"></span></label>' +
      '<p id="calcSavingsHint" class="calc-form__hint"></p>' +
      '<div class="calc-form__actions">' +
      '<button type="submit" class="btn btn--primary" data-i18n="calc_btn"></button>' +
      '<button type="button" class="btn btn--outline" id="calcFillBtn" data-i18n="calc_fill"></button>' +
      '<button type="button" class="btn btn--ghost" id="calcResetBtn" data-i18n="calc_reset"></button>' +
      '</div></form>' +
      '<aside class="card calc-info">' +
      '<h3 class="calc-info__title" data-i18n="calc_how_title"></h3>' +
      '<ul class="calc-info__list">' +
      '<li data-i18n="calc_how_1"></li>' +
      '<li data-i18n="calc_how_2"></li>' +
      '<li data-i18n="calc_how_3"></li>' +
      '</ul></aside>' +
      '</div>' +
      '<div id="calcResult" class="calc-result" hidden></div>' +
      '</div></div>';

    $('booking').parentNode.insertBefore(sec, $('booking'));
  }

  function initCalcBindings() {
    var calcForm = $('calcForm');
    if (!calcForm || calcForm.getAttribute('data-bound') === '1') return;
    calcForm.setAttribute('data-bound', '1');
    calcForm.addEventListener('submit', function (e) {
      e.preventDefault();
      runCalc();
    });
    var fillBtn = $('calcFillBtn');
    if (fillBtn) fillBtn.addEventListener('click', fillCalcFromCabinet);
    var resetBtn = $('calcResetBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetCalcForm);
  }

  function injectHtml() {
    if (!$('loginPin') && $('cabinetLogin')) {
      $('btnLogin').insertAdjacentHTML('beforebegin',
        '<label class="label" for="loginPin" data-i18n="login_pin_lbl"></label>' +
        '<input type="text" id="loginPin" class="input" maxlength="14" inputmode="numeric" data-i18n-placeholder="login_pin_ph" />' +
        '<p class="section__desc login-pin-hint" data-i18n="login_pin_hint"></p>');
    }

    var dash = $('cabinetDashboard');
    if (dash && !dash.querySelector('.cabinet-tabs')) {
      dash.classList.remove('card');
      dash.innerHTML =
        '<div class="card cabinet-overview"><div class="cabinet__head">' +
        '<p><span data-i18n="cabinet_greet_start"></span> <strong id="cabinetUserName"></strong><span data-i18n="cabinet_greet_end"></span></p>' +
        '<button type="button" class="btn btn--outline btn--sm" id="btnLogout" data-i18n="btn_logout"></button></div>' +
        '<div class="dash-widgets" id="cabinetWidgets"></div></div>' +
        '<nav class="cabinet-tabs">' +
        '<button type="button" class="cabinet-tabs__btn cabinet-tabs__btn--active" data-ctab="apps" data-i18n="ctab_apps"></button>' +
        '<button type="button" class="cabinet-tabs__btn" data-ctab="savings" data-i18n="ctab_savings"></button>' +
        '<button type="button" class="cabinet-tabs__btn" data-ctab="experience" data-i18n="ctab_experience"></button>' +
        '<button type="button" class="cabinet-tabs__btn" data-ctab="notifications" data-i18n="ctab_notifications"></button></nav>' +
        '<div class="card cabinet-panel cabinet-panel--active" data-ctab-panel="apps">' +
        '<h3 class="card__title" data-i18n="my_applications_h3"></h3><p class="section__desc" data-i18n="cabinet_list_hint"></p>' +
        '<button type="button" class="btn btn--primary btn--sm" id="btnNewApplication" data-i18n="btn_new_app"></button>' +
        '<div id="cabinetList" class="table-wrap"></div></div>' +
        '<div class="card cabinet-panel" data-ctab-panel="savings" hidden><h3 data-i18n="savings_title"></h3><div id="cabinetSavings"></div></div>' +
        '<div class="card cabinet-panel" data-ctab-panel="experience" hidden><h3 data-i18n="experience_title"></h3><div id="cabinetExperience"></div></div>' +
        '<div class="card cabinet-panel" data-ctab-panel="notifications" hidden><h3 data-i18n="notifications_title"></h3><div id="cabinetNotifications"></div></div>';
      dash.innerHTML = dash.innerHTML.split('<div').join('<div').split('</div>').join('</div>').split('</div>').join('</div>');
    }

    injectCalculator();

    if (false) {
      var sec = document.createElement('section');
      sec.id = 'calculator';
      sec.className = 'section';
      sec.hidden = true;
      sec.innerHTML =
        '<div class="container"><h2><i class="fa-solid fa-calculator"></i> <span data-i18n="calc_title"></span></h2>' +
        '<p class="section__desc" data-i18n="calc_desc"></p>' +
        '<form id="calcForm" class="card card--narrow">' +
        '<label class="label" for="calcAge" data-i18n="calc_age"></label><input type="number" id="calcAge" class="input" value="58" min="50" max="70" />' +
        '<label class="label" for="calcExp" data-i18n="calc_exp"></label><input type="number" id="calcExp" class="input" value="25" min="5" max="45" />' +
        '<label class="label" for="calcSalary" data-i18n="calc_salary"></label><input type="number" id="calcSalary" class="input" value="35000" step="500" />' +
        '<button type="submit" class="btn btn--primary" data-i18n="calc_btn"></button></form>' +
        '<div id="calcResult" class="calc-result" hidden></div></div>';
      sec.innerHTML = sec.innerHTML.split('<div').join('<div').split('</div>').join('</div>').split('</div>').join('</div>');
      $('booking').parentNode.insertBefore(sec, $('booking'));
    }

    var chips = document.querySelector('.chat__chips');
    if (chips && !chips.querySelector('[data-i18n-q="chip_q4"]')) {
      chips.insertAdjacentHTML(
        'beforeend',
        '<button type="button" class="chip" data-i18n-q="chip_q4"></button>' +
          '<button type="button" class="chip" data-i18n-q="chip_q5"></button>'
      );
      if (api().bindChatChips) api().bindChatChips();
    }

    var panel = $('adminPanel');
    if (panel && !panel.querySelector('.admin-tabs')) {
      var table = $('adminTableWrap');
      panel.innerHTML =
        '<nav class="admin-tabs">' +
        '<button type="button" class="admin-tabs__btn admin-tabs__btn--active" data-atab="apps" data-i18n="admin_tab_apps"></button>' +
        '<button type="button" class="admin-tabs__btn" data-atab="queue" data-i18n="admin_tab_queue"></button>' +
        '<button type="button" class="admin-tabs__btn" data-atab="citizens" data-i18n="admin_tab_citizens"></button>' +
        '<button type="button" class="admin-tabs__btn" data-atab="reports" data-i18n="admin_tab_reports"></button></nav>' +
        '<div class="admin-view admin-view--active" data-atab-panel="apps">' +
        '<div class="admin-toolbar card"><label for="adminFilter" data-i18n="admin_filter_lbl"></label>' +
        '<select id="adminFilter" class="input input--inline"><option value="" data-i18n="admin_all_svc"></option>' +
        '<option value="pension" data-i18n="svc_pension"></option><option value="benefit" data-i18n="svc_benefit"></option>' +
        '<option value="certificate" data-i18n="svc_cert"></option><option value="consult" data-i18n="svc_consult"></option></select>' +
        '<button type="button" class="btn btn--outline" id="btnAdminRefresh" data-i18n="admin_refresh"></button></div>' +
        (table ? table.outerHTML : '<div id="adminTableWrap"></div>') + '</div>' +
        '<div class="admin-view" data-atab-panel="queue" hidden><div id="adminQueuePanel"></div></div>' +
        '<div class="admin-view" data-atab-panel="citizens" hidden><div id="adminCitizensPanel" class="card"></div></div>' +
        '<div class="admin-view" data-atab-panel="reports" hidden><div id="adminReportsPanel"></div></div>';
      panel.innerHTML = panel.innerHTML.split('<div').join('<div').split('</div>').join('</div>').split('</div>').join('</div>');
      if (api().fillBookingCatalogs) api().fillBookingCatalogs();
    }

    if ($('bookingSuccessModal') && !$('bookingModalQr')) {
      $('bookingModalStaff').insertAdjacentHTML('afterend',
        '<div id="bookingModalQr" class="modal__qr" hidden><img id="bookingModalQrImg" alt="QR" width="140" height="140" />' +
        '<p class="modal__qr-hint" data-i18n="modal_qr_hint"></p><p id="bookingModalTicket" class="modal__ticket"></p></div>');
    }
  }

  function setCabinetTab(tab) {
    document.querySelectorAll('.cabinet-tabs__btn').forEach(function (b) {
      b.classList.toggle('cabinet-tabs__btn--active', b.getAttribute('data-ctab') === tab);
    });
    document.querySelectorAll('[data-ctab-panel]').forEach(function (p) {
      var on = p.getAttribute('data-ctab-panel') === tab;
      p.hidden = !on;
      p.classList.toggle('cabinet-panel--active', on);
    });
    if (tab === 'savings') renderSavings();
    if (tab === 'experience') renderExperience();
    if (tab === 'notifications') renderNotifications();
  }

  function renderWidgets() {
    var box = $('cabinetWidgets');
    if (!box) return;
    var a = api();
    var apps = a.loadApplications ? a.loadApplications() : [];
    var user = a.getSessionUser ? a.getSessionUser() : null;
    var mine = user ? apps.filter(function (x) {
      return String(x.name).trim().toLowerCase() === String(user.name).trim().toLowerCase();
    }) : [];
    var unread = NOTIFICATIONS.filter(function (n) { return !n.read; }).length;
    var total = EMPLOYMENT.reduce(function (s, r) { return s + r.years; }, 0);
    box.innerHTML =
      '<article class="dash-widget"><i class="fa-solid fa-piggy-bank"></i><p>' + esc(te('widget_savings')) + '</p><strong>' + (hasDemo() ? money(PENSION_BALANCE) : '—') + '</strong></article>' +
      '<article class="dash-widget"><i class="fa-solid fa-briefcase"></i><p>' + esc(te('widget_experience')) + '</p><strong>' + (hasDemo() ? total.toFixed(1) + ' ' + te('exp_years') : '—') + '</strong></article>' +
      '<article class="dash-widget"><i class="fa-solid fa-file-lines"></i><p>' + esc(te('widget_apps')) + '</p><strong>' + mine.length + '</strong></article>' +
      '<article class="dash-widget"><i class="fa-solid fa-bell"></i><p>' + esc(te('widget_notify')) + '</p><strong>' + unread + '</strong></article>';
  }

  function renderSavings() {
    var box = $('cabinetSavings');
    if (!box) return;
    if (!hasDemo()) {
      box.innerHTML = '<p class="section__desc">' + esc(te('savings_need_pin')) + '</p>';
      return;
    }
    var rows = CONTRIBUTIONS.map(function (c) {
      return '<tr><td>' + esc(c.date) + '</td><td>' + esc(c.employer) + '</td><td>' + money(c.amount) + '</td></tr>';
    }).join('');
    box.innerHTML =
      '<div class="savings-hero"><p>' + esc(te('savings_balance')) + '</p><p class="savings-hero__sum">' + money(PENSION_BALANCE) + '</p><p>' + esc(te('savings_updated')) + '</p></div>' +
      '<table class="data-table"><thead><tr><th>' + te('th_contrib_date') + '</th><th>' + te('th_contrib_emp') + '</th><th>' + te('th_contrib_sum') + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function renderExperience() {
    var box = $('cabinetExperience');
    if (!box) return;
    if (!hasDemo()) {
      box.innerHTML = '<p class="section__desc">' + esc(te('savings_need_pin')) + '</p>';
      return;
    }
    var total = EMPLOYMENT.reduce(function (s, r) { return s + r.years; }, 0);
    box.innerHTML = '<p class="exp-total"><strong>' + esc(te('exp_total')) + ':</strong> ' + total.toFixed(1) + ' ' + te('exp_years') + '</p>' +
      EMPLOYMENT.map(function (r) {
        return '<div class="timeline-item"><strong>' + esc(r.employer) + '</strong><p>' + esc(r.position) + '</p><p class="timeline-item__meta">' +
          esc(r.start) + ' - ' + (r.end || te('exp_present')) + '</p></div>';
      }).join('');
  }

  function renderNotifications() {
    var box = $('cabinetNotifications');
    if (!box) return;
    var list = NOTIFICATIONS.map(function (n, i) {
      return '<div class="notify-item' + (n.read ? '' : ' notify-item--unread') + '" data-ni="' + i + '"><strong>' + esc(n.title) + '</strong><p>' + esc(n.msg) + '</p></div>';
    }).join('');
    list = list.split('<div').join('<div').split('</div>').join('</div>').split('</div>').join('</div>');
    box.innerHTML =
      '<div class="notify-settings"><label><input type="checkbox" checked /> ' + esc(te('notify_sms')) + '</label>' +
      '<label><input type="checkbox" checked /> ' + esc(te('notify_email')) + '</label></div><div class="notify-list">' + list + '</div>';
    box.querySelectorAll('.notify-item').forEach(function (el) {
      el.addEventListener('click', function () {
        var i = +el.getAttribute('data-ni');
        if (!isNaN(i)) { NOTIFICATIONS[i].read = true; renderNotifications(); renderWidgets(); }
      });
    });
  }

  function renderAdminQueue() {
    var box = $('adminQueuePanel');
    if (!box) return;
    var list = adminQueue.map(function (q) {
      return '<li class="admin-queue-item' + (q.ticket === adminCurrent ? ' admin-queue-item--active' : '') + '"><b>' + esc(q.ticket) + '</b> ' + esc(q.name) + ' ' + esc(q.time) +
        ' <span class="status-badge status-badge--' + (q.status === 'done' ? 'done' : 'processing') + '">' + esc(q.status === 'done' ? te('admin_served') : te('admin_waiting')) + '</span></li>';
    }).join('');
    box.innerHTML =
      '<div class="admin-queue-call card"><p>' + esc(te('admin_now_calling')) + '</p><p class="admin-queue-call__num">' + esc(adminCurrent) + '</p>' +
      '<button type="button" class="btn btn--primary" id="btnAdminCallNext">' + esc(te('admin_call_next')) + '</button></div>' +
      '<div class="card"><h3>' + esc(te('admin_queue_today')) + '</h3><ul class="admin-queue-list">' + list + '</ul></div>';
    var btn = $('btnAdminCallNext');
    if (btn) btn.onclick = function () {
      var i = adminQueue.findIndex(function (q) { return q.ticket === adminCurrent; });
      if (i >= 0 && i < adminQueue.length - 1) {
        adminQueue[i].status = 'done';
        adminCurrent = adminQueue[i + 1].ticket;
        renderAdminQueue();
      }
    };
  }

  function renderAdminCitizens() {
    var box = $('adminCitizensPanel');
    if (!box) return;
    var apps = api().loadApplications ? api().loadApplications() : [];
    var seen = {};
    box.innerHTML = apps.filter(function (a) {
      if (seen[a.name]) return false;
      seen[a.name] = true;
      return true;
    }).map(function (a) {
      return '<div class="citizen-card"><strong>' + esc(a.name) + '</strong><p>' + esc(a.id) + '</p></div>';
    }).join('') || '<p class="section__desc">—</p>';
  }

  function getOfficeRegionKey(officeId) {
    var cat = typeof SocFondBookingCatalog !== 'undefined' ? SocFondBookingCatalog : null;
    if (!cat || !officeId) return 'region_unknown';
    var id = officeId;
    if (cat.OFFICE_LEGACY && cat.OFFICE_LEGACY[officeId]) id = cat.OFFICE_LEGACY[officeId];
    for (var i = 0; i < cat.BOOKING_OFFICE_REGIONS.length; i++) {
      var reg = cat.BOOKING_OFFICE_REGIONS[i];
      if (reg.offices.indexOf(id) >= 0) return reg.regionKey;
    }
    return 'region_unknown';
  }

  function appGenderLocal(app) {
    if (api().appGender) return api().appGender(app);
    return 'u';
  }

  function serviceLabelLocal(key) {
    if (api().serviceLabel) return api().serviceLabel(key);
    return key;
  }

  function filterAppsByPeriod(apps, period) {
    var now = new Date();
    return apps.filter(function (a) {
      if (period === 'all') return true;
      var raw = a.createdAt || a.date;
      if (!raw) return period === 'year';
      var d = new Date(raw);
      if (isNaN(d.getTime())) return true;
      if (period === 'month') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (period === 'year') return d.getFullYear() === 2026 || d.getFullYear() === now.getFullYear();
      return true;
    });
  }

  function buildAdminReportStats(apps) {
    var stats = {
      total: 0,
      byStatus: { accepted: 0, processing: 0, done: 0 },
      gender: { m: 0, f: 0, u: 0 },
      genderDone: { m: 0, f: 0, u: 0 },
      byRegion: {},
      byService: {},
      byMonth: {},
      online: 0,
      walkIn: 0,
      actions: { pension: 0, benefit: 0, certificate: 0, consult: 0, other: 0 },
    };
    apps.forEach(function (a) {
      stats.total++;
      var st = a.status || 'accepted';
      if (stats.byStatus[st] !== undefined) stats.byStatus[st]++;
      else stats.byStatus.accepted++;
      var g = appGenderLocal(a);
      stats.gender[g] = (stats.gender[g] || 0) + 1;
      if (st === 'done') stats.genderDone[g] = (stats.genderDone[g] || 0) + 1;
      if (a.email && String(a.email).trim()) stats.online++;
      else stats.walkIn++;
      var rk = getOfficeRegionKey(a.office);
      if (!stats.byRegion[rk]) stats.byRegion[rk] = { total: 0, m: 0, f: 0, done: 0 };
      stats.byRegion[rk].total++;
      if (g === 'm' || g === 'f') stats.byRegion[rk][g]++;
      if (st === 'done') stats.byRegion[rk].done++;
      var sk = a.service || 'other';
      if (!stats.byService[sk]) stats.byService[sk] = { total: 0, done: 0 };
      stats.byService[sk].total++;
      if (st === 'done') stats.byService[sk].done++;
      if (/^pension/.test(sk) || sk === 'pension') stats.actions.pension++;
      else if (/^benefit/.test(sk) || sk === 'benefit') stats.actions.benefit++;
      else if (/^cert/.test(sk) || sk === 'certificate') stats.actions.certificate++;
      else if (sk === 'consult') stats.actions.consult++;
      else stats.actions.other++;
      var mk = 'unknown';
      if (a.createdAt) {
        var cd = new Date(a.createdAt);
        if (!isNaN(cd.getTime())) mk = cd.getFullYear() + '-' + String(cd.getMonth() + 1).padStart(2, '0');
      } else if (a.date) mk = String(a.date).slice(0, 7);
      stats.byMonth[mk] = (stats.byMonth[mk] || 0) + 1;
    });
    return stats;
  }

  function reportPct(part, whole) {
    if (!whole) return 0;
    return Math.round((part / whole) * 100);
  }

  function renderReportKpi(val, label, mod) {
    return (
      '<div class="report-stat card' +
      (mod ? ' report-stat--' + mod : '') +
      '"><strong class="report-stat__val">' +
      esc(String(val)) +
      '</strong><p>' +
      esc(label) +
      '</p></div>'
    );
  }

  function renderReportBarRow(label, count, max, mod) {
    var w = max ? Math.max(4, Math.round((count / max) * 100)) : 0;
    return (
      '<div class="admin-report-bar' +
      (mod ? ' admin-report-bar--' + mod : '') +
      '"><span class="admin-report-bar__lbl">' +
      esc(label) +
      '</span><span class="admin-report-bar__track"><span style="width:' +
      w +
      '%"></span></span><span class="admin-report-bar__num">' +
      esc(String(count)) +
      '</span></div>'
    );
  }

  function renderReportGenderBlock(stats, title) {
    var maxG = Math.max(stats.gender.m, stats.gender.f, stats.gender.u, 1);
    var html =
      '<div class="card admin-report-block"><h3>' +
      esc(title) +
      '</h3>' +
      renderReportBarRow(te('admin_reports_male'), stats.gender.m, maxG, 'male') +
      renderReportBarRow(te('admin_reports_female'), stats.gender.f, maxG, 'female');
    if (stats.gender.u) html += renderReportBarRow(te('admin_reports_gender_unknown'), stats.gender.u, maxG, 'unknown');
    html +=
      '<p class="admin-report-foot">' +
      esc(te('admin_reports_male_done')) +
      ': <b>' +
      stats.genderDone.m +
      '</b> · ' +
      esc(te('admin_reports_female_done')) +
      ': <b>' +
      stats.genderDone.f +
      '</b> (' +
      teFmt('admin_reports_pct', { n: reportPct(stats.genderDone.m + stats.genderDone.f, stats.total) }) +
      ')</p></div>';
    return html;
  }

  function renderReportActionsTable(stats) {
    var rows = [
      { key: 'pension', label: te('admin_reports_act_pension') },
      { key: 'benefit', label: te('admin_reports_act_benefit') },
      { key: 'certificate', label: te('admin_reports_act_certificate') },
      { key: 'consult', label: te('admin_reports_act_consult') },
      { key: 'other', label: te('admin_reports_act_other') },
    ];
    var max = 1;
    rows.forEach(function (r) {
      if (stats.actions[r.key] > max) max = stats.actions[r.key];
    });
    var body = rows
      .map(function (r) {
        return renderReportBarRow(r.label, stats.actions[r.key], max);
      })
      .join('');
    body +=
      renderReportBarRow(te('admin_reports_act_booking'), stats.total, stats.total) +
      renderReportBarRow(te('admin_reports_accepted'), stats.byStatus.accepted, stats.total) +
      renderReportBarRow(te('admin_reports_processing'), stats.byStatus.processing, stats.total) +
      renderReportBarRow(te('admin_reports_done'), stats.byStatus.done, stats.total);
    return '<div class="card admin-report-block"><h3>' + esc(te('admin_reports_actions_title')) + '</h3>' + body + '</div>';
  }

  function renderReportRegionTable(byRegion) {
    var keys = Object.keys(byRegion).sort(function (a, b) {
      return (byRegion[b].total || 0) - (byRegion[a].total || 0);
    });
    if (!keys.length) return '';
    var rows = keys
      .map(function (rk) {
        var r = byRegion[rk];
        var name = te(rk) !== rk ? te(rk) : rk;
        return '<tr><td>' + esc(name) + '</td><td>' + r.total + '</td><td>' + (r.m || 0) + '</td><td>' + (r.f || 0) + '</td><td>' + (r.done || 0) + '</td></tr>';
      })
      .join('');
    return (
      '<div class="card admin-report-block"><h3>' +
      esc(te('admin_reports_region_title')) +
      '</h3><div class="table-wrap"><table class="admin-report-table"><thead><tr><th>' +
      esc(te('admin_reports_col_region')) +
      '</th><th>' +
      esc(te('admin_reports_col_total')) +
      '</th><th>' +
      esc(te('admin_reports_col_m')) +
      '</th><th>' +
      esc(te('admin_reports_col_f')) +
      '</th><th>' +
      esc(te('admin_reports_col_done')) +
      '</th></tr></thead><tbody>' +
      rows +
      '</tbody></table></div></div>'
    );
  }

  function renderReportServiceTable(byService) {
    var keys = Object.keys(byService).sort(function (a, b) {
      return (byService[b].total || 0) - (byService[a].total || 0);
    });
    if (!keys.length) return '';
    var rows = keys
      .map(function (sk) {
        var s = byService[sk];
        return '<tr><td>' + esc(serviceLabelLocal(sk)) + '</td><td>' + s.total + '</td><td>' + (s.done || 0) + '</td></tr>';
      })
      .join('');
    return (
      '<div class="card admin-report-block"><h3>' +
      esc(te('admin_reports_service_title')) +
      '</h3><div class="table-wrap"><table class="admin-report-table"><thead><tr><th>' +
      esc(te('admin_reports_col_action')) +
      '</th><th>' +
      esc(te('admin_reports_col_count')) +
      '</th><th>' +
      esc(te('admin_reports_col_done')) +
      '</th></tr></thead><tbody>' +
      rows +
      '</tbody></table></div></div>'
    );
  }

  function renderReportMonthChart(byMonth) {
    var keys = Object.keys(byMonth)
      .filter(function (k) {
        return k !== 'unknown';
      })
      .sort();
    if (!keys.length) return '';
    var vals = keys.map(function (k) {
      return byMonth[k];
    });
    var max = Math.max.apply(null, vals.concat([1]));
    var monthNames = { '01': 'Янв', '02': 'Фев', '03': 'Мар', '04': 'Апр', '05': 'Май', '06': 'Июн', '07': 'Июл', '08': 'Авг', '09': 'Сен', '10': 'Окт', '11': 'Ноя', '12': 'Дек' };
    var bars = keys
      .map(function (k) {
        var v = byMonth[k];
        var parts = k.split('-');
        var lbl = parts[1] ? monthNames[parts[1]] || parts[1] : k;
        return '<div class="chart-bar"><div style="height:' + Math.round((v / max) * 100) + '%"></div><span>' + esc(lbl) + '</span><em>' + v + '</em></div>';
      })
      .join('');
    return '<div class="card admin-report-block"><h3>' + esc(te('admin_reports_chart_title')) + '</h3><div class="chart-bars chart-bars--report">' + bars + '</div></div>';
  }

  function mergeStatsForDisplay(real, useDemo) {
    if (!useDemo) return real;
    var demo = DEMO_BRANCH_REPORT;
    return {
      total: real.total + demo.total,
      byStatus: {
        accepted: real.byStatus.accepted + demo.byStatus.accepted,
        processing: real.byStatus.processing + demo.byStatus.processing,
        done: real.byStatus.done + demo.byStatus.done,
      },
      gender: { m: real.gender.m + demo.gender.m, f: real.gender.f + demo.gender.f, u: real.gender.u + demo.gender.u },
      genderDone: { m: real.genderDone.m + demo.genderDone.m, f: real.genderDone.f + demo.genderDone.f, u: real.genderDone.u + demo.genderDone.u },
      online: real.online + demo.online,
      walkIn: real.walkIn + demo.walkIn,
      byRegion: (function () {
        var out = {};
        Object.keys(demo.byRegion).forEach(function (k) {
          out[k] = Object.assign({}, demo.byRegion[k]);
        });
        Object.keys(real.byRegion).forEach(function (k) {
          if (!out[k]) out[k] = { total: 0, m: 0, f: 0, done: 0 };
          out[k].total += real.byRegion[k].total;
          out[k].m += real.byRegion[k].m || 0;
          out[k].f += real.byRegion[k].f || 0;
          out[k].done += real.byRegion[k].done || 0;
        });
        return out;
      })(),
      byService: real.byService,
      byMonth: (function () {
        var out = Object.assign({}, demo.byMonth);
        Object.keys(real.byMonth).forEach(function (k) {
          out[k] = (out[k] || 0) + real.byMonth[k];
        });
        return out;
      })(),
      actions: {
        pension: real.actions.pension + demo.actions.pension,
        benefit: real.actions.benefit + demo.actions.benefit,
        certificate: real.actions.certificate + demo.actions.certificate,
        consult: real.actions.consult + demo.actions.consult,
        other: real.actions.other + demo.actions.other,
      },
    };
  }

  var adminReportPdfBusy = false;

  function getAdminReportPeriodLabel() {
    if (adminReportPeriod === 'month') return te('admin_reports_period_month');
    if (adminReportPeriod === 'year') return te('admin_reports_period_year');
    return te('admin_reports_period_all');
  }

  function getAdminReportData() {
    var allApps = api().loadApplications ? api().loadApplications() : [];
    var filtered = filterAppsByPeriod(allApps, adminReportPeriod);
    var realStats = buildAdminReportStats(filtered);
    var useDemo = realStats.total < 8;
    var stats = useDemo ? mergeStatsForDisplay(realStats, true) : realStats;
    return {
      stats: stats,
      realStats: realStats,
      useDemo: useDemo,
      periodLabel: getAdminReportPeriodLabel(),
      generatedAt: new Date(),
    };
  }

  function getPdfMake() {
    if (typeof pdfMake !== 'undefined') return pdfMake;
    if (typeof window.pdfMake !== 'undefined') return window.pdfMake;
    return null;
  }

  function pdfRow() {
    var cells = [];
    for (var i = 0; i < arguments.length; i++) cells.push(String(arguments[i]));
    return cells;
  }

  function pdfHdrRow() {
    var cells = [];
    for (var i = 0; i < arguments.length; i++) {
      cells.push({ text: String(arguments[i]), color: '#ffffff', bold: true, fontSize: 8 });
    }
    return cells;
  }

  function pdfTableBlock(title, headerRow, bodyRows, widths) {
    var body = [headerRow].concat(bodyRows);
    return [
      { text: title, style: 'section' },
      {
        table: { headerRows: 1, widths: widths, body: body },
        layout: {
          fillColor: function (ri) {
            return ri === 0 ? '#0f172a' : ri % 2 === 0 ? '#f1f5f9' : null;
          },
          hLineColor: '#cbd5e1',
          vLineColor: '#cbd5e1',
          paddingLeft: function () { return 6; },
          paddingRight: function () { return 6; },
          paddingTop: function () { return 4; },
          paddingBottom: function () { return 4; },
        },
        margin: [0, 0, 0, 8],
      },
    ];
  }

  function buildReportPdfDocDefinition(payload) {
    var stats = payload.stats;
    var meta = payload;
    var dateStr = meta.generatedAt.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    var content = [
      { text: te('admin_reports_pdf_doc_title'), style: 'header' },
      {
        text:
          te('admin_reports_pdf_generated') +
          ': ' +
          dateStr +
          '   |   ' +
          te('admin_reports_pdf_period') +
          ': ' +
          meta.periodLabel,
        style: 'meta',
      },
    ];

    if (meta.realStats.total === 0) {
      content.push({ text: te('admin_reports_demo_note'), style: 'note' });
    } else if (meta.useDemo) {
      content.push({
        text: te('admin_reports_your_data') + ': ' + meta.realStats.total + '. ' + te('admin_reports_demo_note'),
        style: 'note',
      });
    }

    var kpiBody = [
      pdfRow(te('admin_reports_total'), stats.total),
      pdfRow(te('admin_reports_done'), stats.byStatus.done),
      pdfRow(te('admin_reports_processing'), stats.byStatus.processing),
      pdfRow(te('admin_reports_accepted'), stats.byStatus.accepted),
      pdfRow(te('admin_reports_male'), stats.gender.m),
      pdfRow(te('admin_reports_female'), stats.gender.f),
      pdfRow(te('admin_reports_male_done'), stats.genderDone.m),
      pdfRow(te('admin_reports_female_done'), stats.genderDone.f),
      pdfRow(te('admin_reports_online'), stats.online),
      pdfRow(te('admin_reports_office'), stats.walkIn),
    ];
    content = content.concat(
      pdfTableBlock(
        te('admin_reports_pdf_section_kpi'),
        pdfHdrRow(te('admin_reports_col_action'), te('admin_reports_col_count')),
        kpiBody,
        ['*', 60]
      )
    );

    var genderBody = [
      pdfRow(te('admin_reports_male'), stats.gender.m),
      pdfRow(te('admin_reports_female'), stats.gender.f),
    ];
    if (stats.gender.u) genderBody.push(pdfRow(te('admin_reports_gender_unknown'), stats.gender.u));
    content = content.concat(
      pdfTableBlock(
        te('admin_reports_pdf_section_gender'),
        pdfHdrRow(te('admin_reports_col_action'), te('admin_reports_col_count')),
        genderBody,
        ['*', 60]
      )
    );

    var actionBody = [
      pdfRow(te('admin_reports_act_pension'), stats.actions.pension),
      pdfRow(te('admin_reports_act_benefit'), stats.actions.benefit),
      pdfRow(te('admin_reports_act_certificate'), stats.actions.certificate),
      pdfRow(te('admin_reports_act_consult'), stats.actions.consult),
      pdfRow(te('admin_reports_act_other'), stats.actions.other),
      pdfRow(te('admin_reports_act_booking'), stats.total),
      pdfRow(te('admin_reports_accepted'), stats.byStatus.accepted),
      pdfRow(te('admin_reports_processing'), stats.byStatus.processing),
      pdfRow(te('admin_reports_done'), stats.byStatus.done),
    ];
    content = content.concat(
      pdfTableBlock(
        te('admin_reports_pdf_section_actions'),
        pdfHdrRow(te('admin_reports_col_action'), te('admin_reports_col_count')),
        actionBody,
        ['*', 60]
      )
    );

    var regionKeys = Object.keys(stats.byRegion).sort(function (a, b) {
      return (stats.byRegion[b].total || 0) - (stats.byRegion[a].total || 0);
    });
    var regionBody = regionKeys.map(function (rk) {
      var r = stats.byRegion[rk];
      var name = te(rk) !== rk ? te(rk) : rk;
      return pdfRow(name, r.total, r.m || 0, r.f || 0, r.done || 0);
    });
    if (!regionBody.length) regionBody.push(pdfRow('—', '—', '—', '—', '—'));
    content = content.concat(
      pdfTableBlock(
        te('admin_reports_region_title'),
        pdfHdrRow(
          te('admin_reports_col_region'),
          te('admin_reports_col_total'),
          te('admin_reports_col_m'),
          te('admin_reports_col_f'),
          te('admin_reports_col_done')
        ),
        regionBody,
        ['*', 40, 28, 28, 28, 40]
      )
    );

    var serviceKeys = Object.keys(stats.byService).sort(function (a, b) {
      return (stats.byService[b].total || 0) - (stats.byService[a].total || 0);
    });
    var serviceBody = serviceKeys.map(function (sk) {
      var s = stats.byService[sk];
      return pdfRow(serviceLabelLocal(sk), s.total, s.done || 0);
    });
    if (!serviceBody.length) serviceBody.push(pdfRow('—', '—', '—'));
    content = content.concat(
      pdfTableBlock(
        te('admin_reports_service_title'),
        pdfHdrRow(te('admin_reports_col_action'), te('admin_reports_col_count'), te('admin_reports_col_done')),
        serviceBody,
        ['*', 45, 45]
      )
    );

    var monthNames = {
      '01': 'Янв', '02': 'Фев', '03': 'Мар', '04': 'Апр', '05': 'Май', '06': 'Июн',
      '07': 'Июл', '08': 'Авг', '09': 'Сен', '10': 'Окт', '11': 'Ноя', '12': 'Дек',
    };
    var monthBody = Object.keys(stats.byMonth)
      .filter(function (k) { return k !== 'unknown'; })
      .sort()
      .map(function (k) {
        var parts = k.split('-');
        var lbl = parts[1] ? monthNames[parts[1]] || parts[1] : k;
        if (parts[0]) lbl = parts[0] + ' ' + lbl;
        return pdfRow(lbl, stats.byMonth[k]);
      });
    if (!monthBody.length) monthBody.push(pdfRow('—', '—'));
    content = content.concat(
      pdfTableBlock(
        te('admin_reports_chart_title'),
        pdfHdrRow(te('admin_reports_chart_title'), te('admin_reports_col_count')),
        monthBody,
        ['*', 60]
      )
    );

    content.push({ text: te('admin_reports_pdf_footer'), style: 'footer' });

    return {
      pageSize: 'A4',
      pageMargins: [36, 40, 36, 40],
      content: content,
      defaultStyle: { font: 'Roboto', fontSize: 9, color: '#0f172a' },
      styles: {
        header: { fontSize: 15, bold: true, margin: [0, 0, 0, 6] },
        meta: { fontSize: 8, color: '#64748b', margin: [0, 0, 0, 6] },
        note: { fontSize: 8, color: '#64748b', italics: true, margin: [0, 0, 0, 8] },
        section: { fontSize: 10, bold: true, color: '#0d9488', margin: [0, 8, 0, 4] },
        footer: { fontSize: 7, color: '#94a3b8', margin: [0, 10, 0, 0] },
      },
    };
  }

  function loadPdfMakeLibs(done) {
    if (getPdfMake()) {
      done(true);
      return;
    }
    var urls = [
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/pdfmake.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/vfs_fonts.js',
    ];
    var i = 0;
    function next() {
      if (i >= urls.length) {
        done(!!getPdfMake());
        return;
      }
      var s = document.createElement('script');
      s.src = urls[i];
      s.onload = function () {
        i++;
        next();
      };
      s.onerror = function () {
        done(false);
      };
      document.head.appendChild(s);
    }
    next();
  }

  function runPdfDownload() {
    var pm = getPdfMake();
    var btn = $('btnAdminReportPdf');
    var payload = getAdminReportData();
    var stamp = payload.generatedAt;
    var fname =
      'socfond-otchet-' +
      stamp.getFullYear() +
      '-' +
      String(stamp.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(stamp.getDate()).padStart(2, '0') +
      '.pdf';
    try {
      pm.createPdf(buildReportPdfDocDefinition(payload)).download(fname, function () {
        adminReportPdfBusy = false;
        if (btn) btn.disabled = false;
        if (api().toast) api().toast(te('admin_reports_pdf_ok'), 'ok');
      });
    } catch (err) {
      adminReportPdfBusy = false;
      if (btn) btn.disabled = false;
      if (api().toast) api().toast(te('admin_reports_pdf_error'), 'err');
      if (typeof console !== 'undefined' && console.error) console.error('PDF error:', err);
    }
  }

  function downloadAdminReportPdf() {
    if (adminReportPdfBusy) return;
    adminReportPdfBusy = true;
    var btn = $('btnAdminReportPdf');
    if (btn) btn.disabled = true;
    if (api().toast) api().toast(te('admin_reports_pdf_generating'), 'info');

    function finish(ok) {
      if (!ok || !getPdfMake()) {
        adminReportPdfBusy = false;
        if (btn) btn.disabled = false;
        if (api().toast) api().toast(te('admin_reports_pdf_error'), 'err');
        return;
      }
      runPdfDownload();
    }

    if (getPdfMake()) finish(true);
    else loadPdfMakeLibs(finish);
  }

  function renderAdminReports() {
    var box = $('adminReportsPanel');
    if (!box) return;
    var payload = getAdminReportData();
    var stats = payload.stats;
    var realStats = payload.realStats;
    var useDemo = payload.useDemo;
    var periodSelect =
      '<label class="admin-report-period"><span>' +
      esc(te('admin_reports_period')) +
      '</span> <select id="adminReportPeriod" class="input input--inline">' +
      '<option value="all"' +
      (adminReportPeriod === 'all' ? ' selected' : '') +
      '>' +
      esc(te('admin_reports_period_all')) +
      '</option><option value="month"' +
      (adminReportPeriod === 'month' ? ' selected' : '') +
      '>' +
      esc(te('admin_reports_period_month')) +
      '</option><option value="year"' +
      (adminReportPeriod === 'year' ? ' selected' : '') +
      '>' +
      esc(te('admin_reports_period_year')) +
      '</option></select></label>' +
      '<button type="button" class="btn btn--primary btn--sm" id="btnAdminReportPdf">' +
      '<i class="fa-solid fa-file-pdf" aria-hidden="true"></i> ' +
      esc(te('admin_reports_download_pdf')) +
      '</button>';
    var note = '';
    if (realStats.total === 0) {
      note = '<p class="admin-report-note">' + esc(te('admin_reports_demo_note')) + '</p>';
    } else if (useDemo) {
      note =
        '<p class="admin-report-note">' +
        esc(te('admin_reports_your_data')) +
        ': <b>' +
        realStats.total +
        '</b>. ' +
        esc(te('admin_reports_demo_note')) +
        '</p>';
    }
    var kpis =
      '<div class="report-stats report-stats--wide">' +
      renderReportKpi(stats.total, te('admin_reports_total')) +
      renderReportKpi(stats.byStatus.done, te('admin_reports_done'), 'ok') +
      renderReportKpi(stats.byStatus.processing, te('admin_reports_processing'), 'warn') +
      renderReportKpi(stats.gender.m, te('admin_reports_male'), 'male') +
      renderReportKpi(stats.gender.f, te('admin_reports_female'), 'female') +
      renderReportKpi(stats.online, te('admin_reports_online')) +
      renderReportKpi(stats.walkIn, te('admin_reports_office')) +
      '</div>';
    var grid =
      '<div class="admin-report-grid">' +
      renderReportGenderBlock(stats, te('admin_reports_gender_title')) +
      renderReportActionsTable(stats) +
      '</div>';
    box.innerHTML =
      '<div class="admin-report-head card"><h3>' +
      esc(te('admin_reports_title')) +
      '</h3><p class="section__desc">' +
      esc(te('admin_reports_desc')) +
      '</p>' +
      '<div class="admin-report-toolbar">' +
      periodSelect +
      '</div>' +
      note +
      '</div>' +
      kpis +
      grid +
      renderReportRegionTable(stats.byRegion) +
      renderReportServiceTable(stats.byService) +
      renderReportMonthChart(stats.byMonth);
    var sel = $('adminReportPeriod');
    if (sel) {
      sel.onchange = function () {
        adminReportPeriod = sel.value;
        renderAdminReports();
      };
    }
    var pdfBtn = $('btnAdminReportPdf');
    if (pdfBtn) pdfBtn.onclick = downloadAdminReportPdf;
  }

  function setAdminTab(tab) {
    document.querySelectorAll('.admin-tabs__btn').forEach(function (b) {
      b.classList.toggle('admin-tabs__btn--active', b.getAttribute('data-atab') === tab);
    });
    document.querySelectorAll('[data-atab-panel]').forEach(function (p) {
      p.hidden = p.getAttribute('data-atab-panel') !== tab;
    });
    if (tab === 'apps' && api().renderAdminTable) api().renderAdminTable();
    if (tab === 'queue') renderAdminQueue();
    if (tab === 'citizens') renderAdminCitizens();
    if (tab === 'reports') renderAdminReports();
  }

  function showQr(id) {
    var box = $('bookingModalQr');
    var img = $('bookingModalQrImg');
    var ticket = $('bookingModalTicket');
    if (!box || !img) return;
    var tnum = 'A-' + String(id || '').replace(/\D/g, '').slice(-3).padStart(3, '0');
    img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=' + encodeURIComponent(id || tnum);
    if (ticket) ticket.textContent = te('modal_ticket') + ' ' + tnum;
    box.hidden = false;
  }

  function portalRefresh() {
    renderWidgets();
    var sp = document.querySelector('[data-ctab-panel="savings"]');
    var ep = document.querySelector('[data-ctab-panel="experience"]');
    if (sp && !sp.hidden) renderSavings();
    if (ep && !ep.hidden) renderExperience();
    renderNotifications();
  }

  window.portalEnhancedAiReply = function (text) {
    var l = (text || '').toLowerCase();
    if (/накопл|жыйноо|saving/i.test(l)) {
      if (!hasDemo()) return te('savings_need_pin');
      return (
        te('widget_savings') +
        ': ' +
        money(PENSION_BALANCE) +
        '.\n' +
        te('savings_updated') +
        '. ' +
        (api().t ? api().t('ai_hint_status') : '')
      );
    }
    if (/стаж|experience/i.test(l)) {
      if (!hasDemo()) return te('savings_need_pin');
      var total = EMPLOYMENT.reduce(function (s, r) { return s + r.years; }, 0);
      var lines = [te('exp_total') + ': ' + total.toFixed(1) + ' ' + te('exp_years')];
      EMPLOYMENT.forEach(function (r) {
        lines.push(
          '• ' +
            r.employer +
            ' — ' +
            r.years +
            ' ' +
            te('exp_years') +
            ' (' +
            r.start +
            ' — ' +
            (r.end || te('exp_present')) +
            ')'
        );
      });
      return lines.join('\n');
    }
    if (/калькулятор|calculator/i.test(l)) {
      return (
        te('calc_desc') +
        '\n\n' +
        te('calc_how_1') +
        '\n' +
        te('calc_how_2') +
        (api().showSection ? '\n→ ' + te('nav_calculator') : '')
      );
    }
    return null;
  };

  function init() {
    mergeI18n();
    injectHtml();
    mergeI18n();
    applyExtraI18n();

    document.querySelectorAll('.cabinet-tabs__btn').forEach(function (b) {
      b.addEventListener('click', function () { setCabinetTab(b.getAttribute('data-ctab')); });
    });
    document.querySelectorAll('[data-cabinet-tab]').forEach(function (el) {
      el.addEventListener('click', function () {
        setTimeout(function () { setCabinetTab(el.getAttribute('data-cabinet-tab')); }, 150);
      });
    });

    var loginBtn = $('btnLogin');
    if (loginBtn) loginBtn.addEventListener('click', function () {
      var pin = ($('loginPin') && $('loginPin').value || '').replace(/\D/g, '');
      setPin(pin === DEMO_PIN ? pin : '');
    }, true);

    var newApp = $('btnNewApplication');
    if (newApp) newApp.addEventListener('click', function () {
      if (api().showSection) api().showSection('booking');
    });

    document.querySelectorAll('.admin-tabs__btn').forEach(function (b) {
      b.addEventListener('click', function () { setAdminTab(b.getAttribute('data-atab')); });
    });

    initCalcBindings();

    var a = api();
    if (a.showSection) {
      var orig = a.showSection;
      window.socfondApi.showSection = function (id) {
        orig(id);
        if (id === 'cabinet') { portalRefresh(); setCabinetTab('apps'); }
        if (id === 'calculator') {
          applyExtraI18n();
          loadCalcForm();
        }
        if (id === 'admin' && a.isAdmin && a.isAdmin()) setAdminTab('apps');
      };
    }
    if (a.refreshCabinet) {
      var origR = a.refreshCabinet;
      window.socfondApi.refreshCabinet = function () { origR(); portalRefresh(); };
    }
    window.socfondApi.renderAdminReports = renderAdminReports;
    window.socfondApi.downloadAdminReportPdf = downloadAdminReportPdf;
    if (a.renderAdminTable) {
      var origAdminTable = a.renderAdminTable;
      window.socfondApi.renderAdminTable = function () {
        origAdminTable();
        var reportsPanel = document.querySelector('[data-atab-panel="reports"]');
        if (reportsPanel && !reportsPanel.hidden) renderAdminReports();
      };
    }

    var modal = $('bookingSuccessModal');
    if (modal) {
      new MutationObserver(function () {
        if (!modal.hidden && $('bookingModalText')) {
          var m = $('bookingModalText').textContent.match(/SF-\d{4}-\d{4}/i);
          if (m) showQr(m[0]);
        }
      }).observe(modal, { attributes: true, attributeFilter: ['hidden'] });
    }

    document.querySelectorAll('.lang-switch__btn').forEach(function (b) {
      b.addEventListener('click', function () {
        setTimeout(function () {
          mergeI18n();
          applyExtraI18n();
          var reportsPanel = document.querySelector('[data-atab-panel="reports"]');
          if (reportsPanel && !reportsPanel.hidden) renderAdminReports();
        }, 60);
      });
    });

    if (api().bindChatChips) api().bindChatChips();
  }

  function start() {
    if (window.socfondApi) { init(); applyExtraI18n(); }
    else setTimeout(start, 50);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
