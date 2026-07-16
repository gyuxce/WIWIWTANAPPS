const Policy = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center sm:text-3xl md:text-4xl">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mt-2 text-center">Last updated: March 05, 2024</p>

      <section className="mt-6">
        <p>
          Your privacy is important to us. It is our policy to respect your privacy regarding any information we may
          collect from you across our website, [Your Website], and other sites we own and operate.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Information We Collect</h2>
        <p>
          We collect information directly from you when you provide it to us, and automatically as you navigate through
          the site.
        </p>

        <h3 className="mt-4 font-semibold">Personal Information</h3>
        <p>We may ask for personal information, such as your:</p>
        <ul className="list-disc pl-5">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
        </ul>

        <h3 className="mt-4 font-semibold">Log Data</h3>
        <p>
          When you visit our website, our servers may automatically log the standard data provided by your web browser.
          This data is considered “non-identifying information”, as it does not personally identify you on its own.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Use of Information</h2>
        <p>We may use the information collected from you in various ways, including to:</p>
        <ul className="list-disc pl-5">
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>
            Communicate with you, either directly or through one of our partners, including for customer service, to
            provide you with updates and other information relating to the website, and for marketing and promotional
            purposes
          </li>
          <li>Send you emails</li>
          <li>Find and prevent fraud</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Sharing of Information</h2>
        <p>
          We only share information with your consent, to comply with laws, to provide you with services, to protect
          your rights, or to fulfill business obligations.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Contact Us</h2>
        <p>If you have any questions about this privacy policy, please contact us at hello@wiwitanbaru.com.</p>
      </section>
    </div>
  );
};

export default Policy;
