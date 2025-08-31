// Unit Conversion Library
// Consolidated conversion functions for length, weight, and temperature

const UnitConverter = {
  // Length conversions (base unit: meters)
  length: {
    base: {
      millimeter: 0.001,
      centimeter: 0.01,
      meter: 1,
      kilometer: 1000,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.34
    },
    
    convert: function(value, from, to) {
      if (!(from in this.base) || !(to in this.base)) return NaN;
      const meters = value * this.base[from];
      return meters / this.base[to];
    }
  },

  // Weight conversions (base unit: grams)
  weight: {
    base: {
      milligram: 0.001,
      gram: 1,
      kilogram: 1000,
      ounce: 28.3495,
      pound: 453.592
    },
    
    convert: function(value, from, to) {
      if (!(from in this.base) || !(to in this.base)) return NaN;
      const grams = value * this.base[from];
      return grams / this.base[to];
    }
  },

  // Temperature conversions
  temperature: {
    convert: function(value, from, to) {
      if (from === to) return value;
      
      // First convert to Celsius as intermediate
      let c;
      if (from === 'celsius') c = value;
      else if (from === 'fahrenheit') c = (value - 32) * 5 / 9;
      else if (from === 'kelvin') c = value - 273.15;
      else return NaN;
      
      // Then convert from Celsius to target
      if (to === 'celsius') return c;
      else if (to === 'fahrenheit') return c * 9 / 5 + 32;
      else if (to === 'kelvin') return c + 273.15;
      else return NaN;
    }
  },

  // Utility function to format unit names
  formatUnitName: function(unit) {
    return unit.charAt(0).toUpperCase() + unit.slice(1);
  }
};

// DOM utility functions for interactive conversion
const ConverterUI = {
  init: function(type) {
    const form = document.querySelector('form');
    const resultDiv = document.getElementById('result');
    
    if (!form || !resultDiv) return;
    
    // Prevent form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.performConversion(type);
    });
    
    // Auto-convert on input change
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.performConversion(type));
      input.addEventListener('change', () => this.performConversion(type));
    });
    
    // Initial conversion if values exist
    this.performConversion(type);
  },

  performConversion: function(type) {
    const valueInput = document.getElementById('value');
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    const resultDiv = document.getElementById('result');
    
    if (!valueInput || !fromSelect || !toSelect || !resultDiv) return;
    
    const value = parseFloat(valueInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;
    
    if (isNaN(value) || !from || !to) {
      resultDiv.innerHTML = '';
      return;
    }
    
    let result;
    switch(type) {
      case 'length':
        result = UnitConverter.length.convert(value, from, to);
        break;
      case 'weight':
        result = UnitConverter.weight.convert(value, from, to);
        break;
      case 'temperature':
        result = UnitConverter.temperature.convert(value, from, to);
        break;
    }
    
    if (isNaN(result)) {
      resultDiv.innerHTML = '<span style="color: red;">Invalid conversion</span>';
      return;
    }
    
    const formattedFrom = UnitConverter.formatUnitName(from);
    const formattedTo = UnitConverter.formatUnitName(to);
    
    resultDiv.innerHTML = `
      <div style="margin-top: 1em; padding: 1em; background: #f0f9ff; border-radius: 0.5em; border-left: 4px solid #3b82f6;">
        <strong>Result:</strong> ${value} ${formattedFrom} = ${result.toFixed(6)} ${formattedTo}
      </div>
    `;
  }
};