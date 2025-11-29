import React, { useState, useEffect, useRef } from 'react';
import { toJpeg } from 'html-to-image';
import { FaWhatsapp, FaTruckMoving, FaMapMarkerAlt, FaCalendarAlt, FaUser } from 'react-icons/fa';

interface IBGEUF {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECidade {
  id: number;
  nome: string;
}

interface OrcamentoData {
  clienteNome: string;
  origemUF: string;
  origemCidade: string;
  origemBairro: string;
  destinoUF: string;
  destinoCidade: string;
  destinoBairro: string;

  dataServico: string;
  valorTotal: string;
  observacoes: string;
  seuNome: string;
  suaEmpresa: string;
  seuContato: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<OrcamentoData>({
    clienteNome: '',
    origemUF: '',
    origemCidade: '',
    origemBairro: '',
    destinoUF: '',
    destinoCidade: '',
    destinoBairro: '',
    dataServico: new Date().toISOString().split('T')[0],
    valorTotal: '',
    observacoes: '',
    seuNome: 'Seu Nome',
    suaEmpresa: 'Nome da Transportadora',
    seuContato: ''
  });

  const [ufs, setUfs] = useState<IBGEUF[]>([]);
  const [cidadesOrigem, setCidadesOrigem] = useState<IBGECidade[]>([]);
  const [cidadesDestino, setCidadesDestino] = useState<IBGECidade[]>([]);

  const orcamentoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => res.json())
      .then(data => setUfs(data));
  }, []);

  useEffect(() => {
    if (data.origemUF) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${data.origemUF}/municipios`)
        .then(res => res.json())
        .then(data => setCidadesOrigem(data));
    }
  }, [data.origemUF]);

  useEffect(() => {
    if (data.destinoUF) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${data.destinoUF}/municipios`)
        .then(res => res.json())
        .then(data => setCidadesDestino(data));
    }
  }, [data.destinoUF]);

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

    return (Number(numericValue) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2')
      .substring(0, 15);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'valorTotal') {
      setData(prev => ({ ...prev, [name]: formatCurrency(value) }));
    } else if (name === 'seuContato') {
      setData(prev => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDownloadImage = async () => {
    if (orcamentoRef.current) {
      try {
        const dataUrl = await toJpeg(orcamentoRef.current, { quality: 0.95, backgroundColor: '#ffffff' });
        const link = document.createElement('a');
        link.download = `orcamento-${data.clienteNome || 'frete'}.jpg`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Erro ao gerar imagem:', error);
        alert('Erro ao gerar imagem.');
      }
    }
  };

  const formatAddress = (uf: string, cidade: string, bairro: string) => {
    if (!cidade) return 'Selecione a cidade...';
    return `${cidade} - ${uf}${bairro ? `, ${bairro}` : ''}`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto">

      <div className="w-full xl:w-1/3 bg-white p-6 rounded-xl shadow-md h-fit overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaTruckMoving className="text-blue-600" /> Dados do Frete
        </h2>
        <form className="flex flex-col gap-4">
          <div>
            <label className="label-padrao">Nome do Cliente</label>
            <input type="text" name="clienteNome" value={data.clienteNome} onChange={handleChange} className="input-padrao" placeholder="Ex: Sr. João" />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><FaMapMarkerAlt className="text-red-500" /> Origem (Coleta)</p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <select name="origemUF" value={data.origemUF} onChange={handleChange} className="input-padrao col-span-1">
                <option value="">UF</option>
                {ufs.map(uf => <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>)}
              </select>
              <select name="origemCidade" value={data.origemCidade} onChange={handleChange} className="input-padrao col-span-2" disabled={!data.origemUF}>
                <option value="">Cidade...</option>
                {cidadesOrigem.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
              </select>
            </div>
            <input type="text" name="origemBairro" value={data.origemBairro} onChange={handleChange} className="input-padrao" placeholder="Bairro (Digite aqui)" />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><FaMapMarkerAlt className="text-green-500" /> Destino (Entrega)</p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <select name="destinoUF" value={data.destinoUF} onChange={handleChange} className="input-padrao col-span-1">
                <option value="">UF</option>
                {ufs.map(uf => <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>)}
              </select>
              <select name="destinoCidade" value={data.destinoCidade} onChange={handleChange} className="input-padrao col-span-2" disabled={!data.destinoUF}>
                <option value="">Cidade...</option>
                {cidadesDestino.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
              </select>
            </div>
            <input type="text" name="destinoBairro" value={data.destinoBairro} onChange={handleChange} className="input-padrao" placeholder="Bairro (Digite aqui)" />
          </div>

          <div>
            <label className="label-padrao">Data</label>
            <input type="date" name="dataServico" value={data.dataServico} onChange={handleChange} className="input-padrao max-w-[22rem]" />
          </div>

          <div>
            <label className="label-padrao">Valor Total</label>
            <input type="text" name="valorTotal" value={data.valorTotal} onChange={handleChange} className="input-padrao font-bold text-green-700" placeholder="R$ 0,00" />
          </div>

          <div>
            <label className="label-padrao">Observações</label>
            <textarea name="observacoes" value={data.observacoes} onChange={handleChange} className="input-padrao" rows={2}></textarea>
          </div>

          <hr className="my-2 border-gray-200" />

          {/* Seus Dados */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label-padrao">Seu Nome</label>
              <input type="text" name="seuNome" value={data.seuNome} onChange={handleChange} className="input-padrao text-sm bg-blue-50" />
            </div>
            <div>
              <label className="label-padrao">Sua Empresa</label>
              <input type="text" name="suaEmpresa" value={data.suaEmpresa} onChange={handleChange} className="input-padrao text-sm bg-blue-50" />
            </div>
          </div>
          <div>
            <label className="label-padrao">Seu WhatsApp</label>
            <input type="text" name="seuContato" value={data.seuContato} onChange={handleChange} maxLength={15} className="input-padrao text-sm bg-blue-50" placeholder="(00) 00000-0000" />
          </div>

          <button type="button" onClick={handleDownloadImage} className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2">
            <FaWhatsapp className="text-xl" /> Baixar Imagem
          </button>
        </form>
      </div>

      <div className="w-full xl:w-2/3 flex justify-center items-start">
        <div
          ref={orcamentoRef}
          className="bg-white w-full max-w-[480px] aspect-[9/16] p-8 shadow-2xl border-t-8 border-blue-600 flex flex-col relative overflow-hidden text-gray-800"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-50 z-0"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-50 rounded-tr-full opacity-50 z-0"></div>

          <div className="z-10 text-center mb-8">
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-blue-900">Orçamento</h1>
            <p className="text-sm text-gray-500 font-medium">Transporte & Logística</p>
          </div>

          <div className="z-10 flex-grow flex flex-col gap-5">

            {data.clienteNome && (
              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <p className="text-xs text-gray-400 uppercase font-bold">Cliente</p>
                <p className="text-xl font-bold text-gray-800">{data.clienteNome}</p>
              </div>
            )}

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute left-[29px] top-8 bottom-8 w-0.5 bg-gray-300 border-l-2 border-dashed"></div>

              <div className="relative z-10 mb-6">
                <FaMapMarkerAlt className="absolute -left-1 top-1 text-red-500 text-lg" />
                <div className="pl-8">
                  <p className="text-xs font-bold text-gray-400 uppercase">Coleta</p>
                  <p className="font-semibold text-gray-800 leading-tight">
                    {formatAddress(data.origemUF, data.origemCidade, data.origemBairro)}
                  </p>
                </div>
              </div>

              <div className="relative z-10">
                <FaMapMarkerAlt className="absolute -left-1 top-1 text-green-600 text-lg" />
                <div className="pl-8">
                  <p className="text-xs font-bold text-gray-400 uppercase">Entrega</p>
                  <p className="font-semibold text-gray-800 leading-tight">
                    {formatAddress(data.destinoUF, data.destinoCidade, data.destinoBairro)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-blue-50 p-3 rounded-lg flex-1">
                <p className="text-xs font-bold text-blue-400 uppercase mb-1 flex items-center gap-1"><FaCalendarAlt /> Data</p>
                <p className="font-bold text-gray-700">{new Date(formatDate(data.dataServico)).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            {data.observacoes && (
              <div className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-gray-600 italic">
                "{data.observacoes}"
              </div>
            )}
          </div>

          <div className="mt-auto z-10">
            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg mb-6 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Valor Total</p>
                <p className="text-xs text-gray-500">Pagamento à vista/Pix</p>
              </div>
              <div className="text-3xl font-bold text-green-400">
                {data.valorTotal || 'R$ 0,00'}
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <FaUser />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm leading-tight">{data.suaEmpresa}</p>
                <p className="text-xs text-gray-500">{data.seuNome}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs font-bold text-green-600 flex items-center justify-end gap-1">
                  <FaWhatsapp /> WhatsApp
                </p>
                <p className="text-sm font-bold text-gray-700">{data.seuContato}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;