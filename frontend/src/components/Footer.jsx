import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4 text-center">
      <p>
        © {new Date().getFullYear()} CasePerl. All rights reserved by BlackPerl.
      </p>
    </footer>
  );
};

export default Footer;
