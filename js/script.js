document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const unit = this.getAttribute('data-unit');
            
            // Update tabs
            tabBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${unit}-tab`).classList.add('active');
            
            // Reset result display
            document.getElementById('resultContainer').style.display = 'none';
        });
    });
    
    // Conversion functionality
    const convertBtns = document.querySelectorAll('.convert-btn');
    const resultContainer = document.getElementById('resultContainer');
    const conversionResult = document.getElementById('conversionResult');
    const explanation = document.getElementById('explanation');
    const resetBtn = document.getElementById('resetBtn');
    
    convertBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const fromUnit = this.getAttribute('data-from');
            const toUnit = this.getAttribute('data-to');
            const inputId = `${fromUnit}-input`;
            const temperature = parseFloat(document.getElementById(inputId).value);
            
            // Validate input
            if (isNaN(temperature)) {
                alert('Masukkan suhu yang valid!');
                return;
            }
            
            // Perform conversion
            const { convertedTemp, formula } = convertTemperature(temperature, fromUnit, toUnit);
            const fromSymbol = getSymbol(fromUnit);
            const toSymbol = getSymbol(toUnit);
            
            // Determine if we should use approximation symbol (≈) for Fahrenheit to Celsius
            const useApproximation = fromUnit === 'fahrenheit' && toUnit === 'celsius';
            const equalitySymbol = useApproximation ? '≈' : '=';
            
            // Display results
            conversionResult.innerHTML = `
                <span class="original-temp">${temperature}${fromSymbol}</span> ${equalitySymbol} 
                <span class="converted-temp">${convertedTemp.toFixed(2)}${toSymbol}</span>
            `;
            
            explanation.textContent = `${temperature}${fromSymbol} sama dengan ${convertedTemp.toFixed(2)}${toSymbol}. Konversi dilakukan dengan rumus: ${formula}`;
            resultContainer.style.display = 'block';
            
            // Scroll to result
            resultContainer.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Reset functionality
    resetBtn.addEventListener('click', function() {
        resultContainer.style.display = 'none';
        document.querySelector('.tab-btn.active').click();
    });
    
    // Helper function to convert temperature
    function convertTemperature(temp, fromUnit, toUnit) {
        let convertedTemp, formula;
        
        if (fromUnit === 'celsius') {
            if (toUnit === 'fahrenheit') {
                convertedTemp = (temp * 9/5) + 32;
                formula = `(°C × 9/5) + 32 = °F`;
            } else { // to kelvin
                convertedTemp = temp + 273.15;
                formula = `°C + 273.15 = K`;
            }
        } else if (fromUnit === 'fahrenheit') {
            if (toUnit === 'celsius') {
                convertedTemp = (temp - 32) * 5/9;
                formula = `(°F − 32) × 5/9 ≈ °C`;
            } else { // to kelvin
                convertedTemp = (temp - 32) * 5/9 + 273.15;
                formula = `(°F − 32) × 5/9 + 273.15 = K`;
            }
        } else { // from kelvin
            if (toUnit === 'celsius') {
                convertedTemp = temp - 273.15;
                formula = `K - 273.15 = °C`;
            } else { // to fahrenheit
                convertedTemp = (temp - 273.15) * 9/5 + 32;
                formula = `(K - 273.15) × 9/5 + 32 = °F`;
            }
        }
        
        return { convertedTemp, formula };
    }
    
    // Helper function to get temperature symbol
    function getSymbol(unit) {
        switch(unit) {
            case 'celsius': return '°C';
            case 'fahrenheit': return '°F';
            case 'kelvin': return 'K';
            default: return '';
        }
    }

    // Auto-update year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});