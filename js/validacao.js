export function valida(input) {
    const tiposDeInput = input.dataset.tipo;

    if(validadores[tiposDeInput]){
        validadores[tiposDeInput](input);
    }

    if(input.validity.valid){
        input.parentElement.classList.remove('input-contanier--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    }else{
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro
        (tiposDeInput, input)
    }

}

const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

const mensagensDeErro = {
    nome: {
        valueMissing: 'O campo nome não pode esta vazio.'
    },
    email: {
        valueMissing: 'O campo de email não pode estar vazio.',
        typeMismatch: 'O email digitado não é válido.'
    },
    senha: {
        valueMissing: 'O campo senha não pode esta vazio.',
        patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos.'

    },
    dataNascimento: {
        valueMissing: 'O campo de data de nascimento não pode esta vazio.',
        customError: 'Você deve ser maior que 18 anos para se cadastrar.'
    },
    cpf: {
        valueMissing: 'O campo CPF não pode esta vazio.',
        customError: 'O CPF digitado não é válido.'
    },
    cep: {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        patternMismatch: 'O CEP digitado não é valido.',
        customError: 'Nãofoi possivel busca o CEP'
    },
    logradouro: {
        valueMissing: 'O campo Logradouro não pode esta vazio.'
    },
    cidade: {
        valueMissing: 'O campo Cidade não pode esta vazio.'
    },
    estado: {
        valueMissing: 'O campo Estado não pode esta vazio.'
    },
}

const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => recuperaCEP(input)
}

function mostraMensagemDeErro(tiposDeInput, input) {
    let mensagem = ''
    tiposDeErro.forEach(erro => {
        if(input.validity[erro]){
            mensagem = mensagensDeErro[tiposDeInput][erro]
        }
    })
    return mensagem
}


function validaDataNascimento(input) {
    const dataRecebida = new Date(input.value);
    let mensagem = '';

    if(!maiorQue18(dataRecebida)){
    mensagem = 'Você deve ser maior que 18 anos para se cadastrar.';
    }

    input.setCustomValidity(mensagem)
}


function maiorQue18(data) {
    const dataAtual = new Date();

    const dataMais18 = new Date(
        data.getUTCFullYear() + 18,
        data.getUTCMonth(), 
        data.getUTCDate());

        return dataMais18 <= dataAtual;

}


function validaCPF(input) {
    const cpfFormatado = input.value.replace(/\D/g, '')
    let mensagem = ''

    if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)){
        mensagem = 'O CPF digitado não é valido.'
    }

    input.setCustomValidity(mensagem)
}

function checaCPFRepetido(cpf) {
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]
    let cpfValido = true

    valoresRepetidos.forEach(valor => {
        if(valor == cpf){

        }
    })

    return cpfValido
}

function checaEstruturaCPF(cpf) {
    const multiplicador = 10 

    return checaDigitoVerificador(cpf, multiplicador)
}

function checaDigitoVerificador(cpf, multiplicador) {
    if(multiplicador >= 12) {
        return true
    }


    let multiplicadorInicial = multiplicador
    let soma = 0
    const cpfSemDigito = cpf.substr(0, multiplicador - 1).split('')
    const digitoVerificador = cpf.charAt(multiplicador -1)
    for(let contador = 0; multiplicadorInicial > 1 ; multiplicadorInicial--) {
        soma = soma + cpfSemDigito[contador] * multiplicadorInicial
        contador++
    }

    if(digitoVerificador == confirmaDigito(soma)) {
        return checaDigitoVerificador(cpf, multiplicador + 1)
    }

    return false
}

function confirmaDigito(soma) {
    return 11 - (soma % 11)
}
//api do cep
function recuperaCEP(input) {
    const cep = input.value.replace(/\D/g, '')
    const url = `https://viacep.com.br/ws/${cep}/json/`
    const options = {
        method: 'GET',
        mode: 'cors',
        Headers: {
            'content-type':  'application/json;charset=utf-8'
        }
    }

    if(!input.validity.patternMismatch && !input.validity.valueMissing){
        fetch(url,options).then(
            Response => Response.json()
        ).then(
            data => {
                if(data.erro) {
                    input.setCustomValidity('Não foi possivelbusca o CEP')
                    return
                }
                input.setCustomValidity('')
                preencherCampoComCEP(data)
                return
            }
        )
    }
}

function preencherCampoComCEP(data) {
    const logradouro = document.querySelector('[data-tipo="logradouro"]')
    const cidade = document.querySelector('[data-tipo="cidade"]')
    const estado = document.querySelector('[data-tipo="estado"]')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf


}