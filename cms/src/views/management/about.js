const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center sm:text-3xl md:text-4xl">About Us</h1>
      <p className="mt-4 text-sm text-gray-600 text-center">Last updated: March 05, 2024</p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">1. Vision</h2>
        <p className="mt-2">
          To bridge the gap between countries with underprivileged population and declining population through job
          creation, and economic empowerment
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">2. Mission</h2>
        <p className="mt-2">
          To empower professionals in becoming internationally capable and competitive human resource to improve their
          quality of life and contribute to their community and country
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">3. Key Activities</h2>
        <ul className="list-disc pl-5 mt-2">
          <li>
            Providing technical, language and human skills training to create a skilled, competent, and mentally strong
            workforce.
          </li>
          <li>
            Providing assistance and guidance through technology to ensure the wellbeing and individual growth of the
            workers during their working period.
          </li>
          <li>
            Providing assistance and guidance through technology to improve their skillset and capabilities to ensure
            economic stability and fulfilled living post working period.
          </li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">4. Problem Statement</h2>
        <p className="mt-2">
          {`The number of cases of prospective interns to Japan who were treated unfairly during the language training
          program even during their working period in Japan as well as the unskilled and unprepared interns in facing
          the work period in Japan became our main concern.  `}
        </p>
        <p className="mt-2">
          Besides, the amount of nursery graduates working in Indonesia, was unable to fully use their skill during
          work. Meanwhile, as the elderly population in Japan keeps on rising, the demand for caregiver worker from
          abroad including Indonesia, also rising.
        </p>
        <p className="mt-2">
          Based on that concern, our philosophy is that the prospective intern students needs to be build so that they
          are not only competent in their expertise, but also have a good character and can compete globally.
        </p>
      </section>
    </div>
  );
};

export default About;
