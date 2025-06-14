
import React from 'react';

const ColorPalette = () => {
  const primaryColors = [
    { name: 'torqx-primary', hex: '#0F172A', class: 'bg-torqx-primary' },
    { name: 'torqx-primary-light', hex: '#1E293B', class: 'bg-torqx-primary-light' }
  ];

  const secondaryColors = [
    { name: 'torqx-secondary', hex: '#0EA5E9', class: 'bg-torqx-secondary' },
    { name: 'torqx-secondary-light', hex: '#38BDF8', class: 'bg-torqx-secondary-light' },
    { name: 'torqx-secondary-dark', hex: '#0284C7', class: 'bg-torqx-secondary-dark' }
  ];

  const accentColors = [
    { name: 'torqx-accent', hex: '#10B981', class: 'bg-torqx-accent' },
    { name: 'torqx-accent-light', hex: '#34D399', class: 'bg-torqx-accent-light' },
    { name: 'torqx-accent-dark', hex: '#059669', class: 'bg-torqx-accent-dark' }
  ];

  const ColorGroup = ({ title, colors }: { title: string; colors: typeof primaryColors }) => (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-torqx-primary">{title}</h3>
      <div className="space-y-3">
        {colors.map((color) => (
          <div key={color.name} className="flex items-center gap-4">
            <div className={`w-16 h-16 ${color.class} rounded-lg shadow-sm`}></div>
            <div>
              <div className="font-mono text-sm">{color.hex}</div>
              <div className="text-sm text-gray-600">{color.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="colors" className="component-section mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold text-torqx-primary mb-8">🎨 Paleta de Cores</h2>
      
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <ColorGroup title="Primárias (Slate)" colors={primaryColors} />
        <ColorGroup title="Secundárias (Sky)" colors={secondaryColors} />
        <ColorGroup title="Accent (Emerald)" colors={accentColors} />
      </div>

      <div className="bg-torqx-primary text-white p-6 rounded-xl">
        <h4 className="font-semibold mb-3">CSS Variables:</h4>
        <pre className="text-sm text-torqx-secondary-light overflow-x-auto">
          <code>{`:root {
  --torqx-primary: #0F172A;
  --torqx-primary-light: #1E293B;
  --torqx-secondary: #0EA5E9;
  --torqx-secondary-light: #38BDF8;
  --torqx-secondary-dark: #0284C7;
  --torqx-accent: #10B981;
  --torqx-accent-light: #34D399;
  --torqx-accent-dark: #059669;
}`}</code>
        </pre>
      </div>
    </section>
  );
};

export default ColorPalette;
