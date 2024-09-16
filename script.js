const brasilAbertoApiKey = 'Z8C5PCLYXLf7tvmGJytJMjXKiU9KfZu9vZEJvCSiKSaowaG8Q01ioo1RwJA0pDoG';

async function calcularDistanciaEntreCEPs(cepA, cepB) {
    const url = `https://api.brasilaberto.com/v1/distance?pointA=${cepA}&pointB=${cepB}&mode=STRAIGHT_LINE`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${brasilAbertoApiKey}`
        }
    });
    if (!response.ok) {
        throw new Error('Erro ao consultar a API Brasil Aberto.');
    }
    const data = await response.json();
    if (!data.result || data.result.distance === undefined) {
        throw new Error('Não foi possível obter a distância.');
    }
    return data.result.distance;
}

function calcularValorFrete(distancia) {
    const valorBase = 15;
    const valorPorKm = 2;
    const kmBase = 10;

    if (distancia <= kmBase) {
        return valorBase;
    } else {
        const kmExtra = distancia - kmBase;
        return valorBase + (kmExtra * valorPorKm);
    }
}

async function calcularFrete() {
    const cep1 = document.getElementById("cep1").value.replace(/\D/g, '');
    const cep2 = document.getElementById("cep2").value.replace(/\D/g, '');
    const resultDiv = document.getElementById("result");

    try {
        const distancia = await calcularDistanciaEntreCEPs(cep1, cep2);
        const valorFrete = calcularValorFrete(distancia);
        resultDiv.innerHTML = `Distância: ${distancia.toFixed(2)} km <br> Valor do frete: R$ ${valorFrete.toFixed(2)}`;
    } catch (error) {
        resultDiv.innerHTML = 'Erro ao calcular. Verifique se seu CEP está certo.';
        console.log(error);
    }
}
