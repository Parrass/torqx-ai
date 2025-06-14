
import React from 'react';

const Typography = () => {
  return (
    <section id="typography" className="component-section mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-torqx-primary mb-8">🔤 Tipografia</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Headings</h3>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-torqx-primary">Heading 1 - 4xl (36px)</h1>
              <code className="text-sm text-gray-600">text-4xl font-bold</code>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-torqx-primary">Heading 2 - 3xl (30px)</h2>
              <code className="text-sm text-gray-600">text-3xl font-bold</code>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-torqx-primary">Heading 3 - 2xl (24px)</h3>
              <code className="text-sm text-gray-600">text-2xl font-semibold</code>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-torqx-primary">Heading 4 - xl (20px)</h4>
              <code className="text-sm text-gray-600">text-xl font-semibold</code>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-torqx-primary">Body Text</h3>
          <div className="space-y-4">
            <div>
              <p className="text-lg text-gray-700">Large text - Usado para introduções e destaques importantes.</p>
              <code className="text-sm text-gray-600">text-lg</code>
            </div>
            <div>
              <p className="text-base text-gray-700">Base text - Texto padrão para conteúdo principal e parágrafos.</p>
              <code className="text-sm text-gray-600">text-base</code>
            </div>
            <div>
              <p className="text-sm text-gray-600">Small text - Para legendas, notas e informações secundárias.</p>
              <code className="text-sm text-gray-600">text-sm text-gray-600</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Typography;
