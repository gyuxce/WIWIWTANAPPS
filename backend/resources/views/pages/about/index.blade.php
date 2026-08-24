<!DOCTYPE html>
<html lang="en" dir="ltr" class="light">

<head>
  <meta charset="utf-8">
  <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>About Us - Wiwitan</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Sen:wght@400..800&display=swap');

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Work Sans', sans-serif;
      margin: 0;
      padding: 0;
      color: #1f2937;
      background-color: #ffffff;
    }

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 20px;
      border-bottom: 1px solid #eef0f4;
    }

    .top-bar img {
      height: 40px;
    }

    .wrap {
      max-width: 720px;
      margin: 0 auto;
      padding: 40px 24px 80px;
    }

    h1.page-title {
      font-family: 'Sen', sans-serif;
      font-weight: 800;
      font-size: 32px;
      color: #262564;
      text-align: center;
      margin: 0 0 8px;
    }

    .updated {
      text-align: center;
      font-size: 13px;
      color: #94A3B8;
      margin: 0 0 40px;
    }

    section {
      margin-bottom: 32px;
    }

    h2.section-title {
      font-family: 'Sen', sans-serif;
      font-weight: 700;
      font-size: 19px;
      color: #262564;
      margin: 0 0 10px;
    }

    p, li {
      font-size: 15px;
      line-height: 1.7;
      color: #374151;
    }

    ul {
      padding-left: 20px;
      margin: 8px 0 0;
    }

    li {
      margin-bottom: 8px;
    }

    footer {
      text-align: center;
      padding: 24px 0;
      border-top: 1px solid #eef0f4;
    }

    footer p {
      color: #94A3B8;
      font-size: 12px;
      margin: 0;
    }
  </style>
</head>

<body>
  <div class="top-bar">
    <img src="{{ asset('images/wiwitan-logo.png') }}" alt="Wiwitan Logo">
  </div>

  <div class="wrap">
    <h1 class="page-title">About Us</h1>
    <p class="updated">Last updated: March 05, 2024</p>

    <section>
      <h2 class="section-title">1. Vision</h2>
      <p>
        To bridge the gap between countries with underprivileged population and declining population through job
        creation, and economic empowerment.
      </p>
    </section>

    <section>
      <h2 class="section-title">2. Mission</h2>
      <p>
        To empower professionals in becoming internationally capable and competitive human resource to improve
        their quality of life and contribute to their community and country.
      </p>
    </section>

    <section>
      <h2 class="section-title">3. Key Activities</h2>
      <ul>
        <li>
          Providing technical, language and human skills training to create a skilled, competent, and mentally
          strong workforce.
        </li>
        <li>
          Providing assistance and guidance through technology to ensure the wellbeing and individual growth of
          the workers during their working period.
        </li>
        <li>
          Providing assistance and guidance through technology to improve their skillset and capabilities to
          ensure economic stability and fulfilled living post working period.
        </li>
      </ul>
    </section>

    <section>
      <h2 class="section-title">4. Problem Statement</h2>
      <p>
        The number of cases of prospective interns to Japan who were treated unfairly during the language
        training program even during their working period in Japan as well as the unskilled and unprepared
        interns in facing the work period in Japan became our main concern.
      </p>
      <p>
        Besides, the amount of nursery graduates working in Indonesia, was unable to fully use their skill
        during work. Meanwhile, as the elderly population in Japan keeps on rising, the demand for caregiver
        worker from abroad including Indonesia, also rising.
      </p>
      <p>
        Based on that concern, our philosophy is that the prospective intern students needs to be build so that
        they are not only competent in their expertise, but also have a good character and can compete globally.
      </p>
    </section>
  </div>

  <footer>
    <p>&copy; {{ date('Y') }} WIWITAN ALL RIGHTS RESERVED</p>
  </footer>
</body>

</html>
