// src/pages/admin/BuatInformasi.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { HiOutlineClipboardCopy, HiOutlineLockClosed, HiOutlineLockOpen, HiPencil, HiSave, HiPlus, HiTrash, HiInformationCircle, HiCheckCircle } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { getAllChatTemplates, createChatTemplate, updateChatTemplate, deleteChatTemplate } from '../../services/api';
import Modal from '../../components/common/Modal';

const DEFAULT_TEMPLATE =
`Assalamualaikum warahmatullahi wabarakatuh..
Selamat malam guys, diberitahukan kepada seluruh anggota UKM ADCOM, Pertemuan rutin akan dilaksanakan pada:

Tanggal   : {{tanggal:"date"}}
Pukul     : {{pukul:"time"}}
Ruangan   : {{ruangan:"Ruang Rapat"}}
Jumlah Peserta: {{jumlah:"number"}}
Email Kontak: {{email_pic:"email"}}

Diharapkan semuanya hadir dan jika berhalangan atau ada kepentingan silahkan izin, terima kasih ✨

*{{catatan:"cth: Bawa Laptop"}}*`;

function BuatInformasi() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [templateContent, setTemplateContent] = useState(DEFAULT_TEMPLATE);
  const [templateName, setTemplateName] = useState('Template Default');

  const [values, setValues] = useState({});
  const [isLocked, setIsLocked] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [message, setMessage] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSaveInfoOpen, setIsSaveInfoOpen] = useState(false);
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const fetchTemplates = async () => {
    try {
      const data = await getAllChatTemplates();
      setTemplates(data);
    } catch (err) {
      setMessage({ type: 'error', text: err.toString() });
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const variables = useMemo(() => {
    const regex = /{{\s*([a-zA-Z0-9_]+)(?::"([^"]+)")?\s*}}/g;
    const matches = [...templateContent.matchAll(regex)];
    const unique = new Map();
    matches.forEach((m) => {
      const key = m[1];
      if (unique.has(key)) return;

      let raw = m[2]; // bisa "time" | "select:Option1|Option2" | "Label Kustom"
      let type = 'text';
      let label = key.replace(/_/g, ' ');

      const known = ['date','time','email','number','tel','url','datetime-local','month','week','color','textarea','select'];
      if (raw) {
        if (raw.startsWith('select:')) {
          type = 'select';
        } else if (known.includes(raw)) {
          type = raw;
        } else {
          label = raw;
        }
      }
      unique.set(key, { key, type, label, raw });
    });
    return Array.from(unique.values());
  }, [templateContent]);

  const finalMessage = useMemo(() => {
    let msg = templateContent;
    variables.forEach((v) => {
      const keyRegex = new RegExp(`{{\\s*${v.key}(?::"([^"]+)")?\\s*}}`, 'g');
      const value = values[v.key] || '';
      msg = msg.replace(keyRegex, value);
    });
    return msg.trim();
  }, [templateContent, values, variables]);

  const handleValueChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(finalMessage);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1600);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(finalMessage);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleTemplateSelect = (e) => {
    const id = e.target.value;
    setSelectedTemplateId(id);
    if (id === '') {
      setTemplateName('Template Default');
      setTemplateContent(DEFAULT_TEMPLATE);
      setIsLocked(true);
    } else {
      const t = templates.find((t) => t._id === id);
      setTemplateName(t.name);
      setTemplateContent(t.content);
      setIsLocked(true);
    }
    setValues({});
  };

  const handleSave = async () => {
    setMessage(null);
    if (!selectedTemplateId) {
      setMessage({ type: 'error', text: 'Tidak bisa menyimpan template default.' });
      return;
    }
    try {
      await updateChatTemplate(selectedTemplateId, { name: templateName, content: templateContent });
      await fetchTemplates();
      setIsSaveInfoOpen(true);
      setIsLocked(true);
    } catch (err) {
      setMessage({ type: 'error', text: err.toString() });
    }
  };

  const handleSaveAsNewOpen = () => {
    setNewTemplateName(templateName + ' (Copy)');
    setIsSaveAsOpen(true);
  };

  const handleSaveAsNew = async () => {
    if (!newTemplateName?.trim()) return;
    try {
      const newTemplate = await createChatTemplate({ name: newTemplateName.trim(), content: templateContent });
      await fetchTemplates();
      setSelectedTemplateId(newTemplate._id);
      setTemplateName(newTemplate.name);
      setIsSaveAsOpen(false);
      setIsSaveInfoOpen(true);
      setIsLocked(true);
    } catch (err) {
      setMessage({ type: 'error', text: err.toString() });
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplateId) return;
    try {
      await deleteChatTemplate(selectedTemplateId);
      await fetchTemplates();
      setSelectedTemplateId('');
      setTemplateName('Template Default');
      setTemplateContent(DEFAULT_TEMPLATE);
      setIsLocked(true);
      setIsDeleteModalOpen(false);
      setValues({});
    } catch (err) {
      setMessage({ type: 'error', text: err.toString() });
      setIsDeleteModalOpen(false);
    }
  };

  const renderInput = (variable) => {
    const common = {
      id: variable.key,
      value: values[variable.key] || '',
      onChange: (e) => handleValueChange(variable.key, e.target.value),
      className: "w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-blue",
      placeholder: variable.label
    };

    if (variable.type === 'select') {
      const opts = (variable.raw || '').slice('select:'.length).split('|').map(s => s.trim()).filter(Boolean);
      return (
        <select {...common}>
          <option value="">-- pilih --</option>
          {opts.map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
      );
    }

    switch (variable.type) {
      case 'date':
        return <input type="date" {...common} />;
      case 'time':
        return (
          <input
            type="time"
            {...common}
            step="60"
            pattern="^([01]\\d|2[0-3]):([0-5]\\d)$"
            placeholder="HH:MM"
            inputMode="numeric"
          />
        );
      case 'email':
        return <input type="email" {...common} />;
      case 'number':
        return <input type="number" {...common} />;
      case 'tel':
        return <input type="tel" {...common} inputMode="tel" />;
      case 'url':
        return <input type="url" {...common} />;
      case 'datetime-local':
        return <input type="datetime-local" {...common} />;
      case 'month':
        return <input type="month" {...common} />;
      case 'week':
        return <input type="week" {...common} />;
      case 'color':
        return <input type="color" {...common} className="h-12 w-24 bg-transparent shadow-none" />;
      case 'textarea':
        return <textarea rows="3" {...common} className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-blue" />;
      default:
        return <input type="text" {...common} />;
    }
  };

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="p-6 md:p-8 bg-neum-bg rounded-xl shadow-neum-out w-full max-w-6xl overflow-hidden border-t-4 border-accent-blue">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
            Buat Informasi (Template Chat)
          </h1>
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center px-4 py-2 bg-neum-bg text-accent-blue font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover"
          >
            <HiInformationCircle className="mr-2" /> Lihat Penggunaan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-neum-bg rounded-lg shadow-neum-in space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">1. Template Anda</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Template Tersimpan</label>
              <select
                value={selectedTemplateId}
                onChange={handleTemplateSelect}
                className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none appearance-none"
              >
                <option value="">-- Template Default (Read-Only) --</option>
                {templates.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Template</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                disabled={isLocked || selectedTemplateId === ''}
                className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Isi Template</label>
              <p className="text-xs text-gray-500 mb-2">
                Gunakan: <code>{'{{variabel:"tipe"}}'}</code>. Contoh: <code>{'{{pukul:"time"}}'}</code>, <code>{'{{catatan:"textarea"}}'}</code>, <code>{'{{jurusan:"select:TI|SI|MI"}}'}</code>.
              </p>
              <textarea
                rows="10"
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                disabled={isLocked}
                className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-blue font-mono disabled:opacity-50"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsLocked(!isLocked)}
                className="flex items-center px-4 py-2 bg-neum-bg text-accent-yellow font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover"
              >
                {isLocked ? <HiOutlineLockClosed className="mr-1" /> : <HiOutlineLockOpen className="mr-1" />}
                {isLocked ? 'Buka Kunci' : 'Kunci'}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isLocked || selectedTemplateId === ''}
                className="flex items-center px-4 py-2 bg-neum-bg text-accent-green font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover disabled:opacity-50"
              >
                <HiSave className="mr-1" /> Simpan
              </button>
              <button
                type="button"
                onClick={handleSaveAsNewOpen}
                disabled={isLocked}
                className="flex items-center px-4 py-2 bg-neum-bg text-accent-blue font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover disabled:opacity-50"
              >
                <HiPlus className="mr-1" /> Simpan Sebagai Baru
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={!selectedTemplateId}
                className="flex items-center px-4 py-2 bg-neum-bg text-accent-red font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover disabled:opacity-50"
              >
                <HiTrash className="mr-1" /> Hapus
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-neum-bg rounded-lg shadow-neum-in">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">2. Isi Input</h3>
              {variables.length > 0 ? (
                <div className="space-y-4">
                  {variables.map((v) => (
                    <div key={v.key}>
                      <label htmlFor={v.key} className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {v.label}
                      </label>
                      {renderInput(v)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Tidak ada variabel ditemukan.</p>
              )}
            </div>

            <div className="p-6 bg-neum-bg rounded-lg shadow-neum-in">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">3. Hasil Pesan</h3>
              <textarea
                rows="10"
                value={finalMessage}
                readOnly
                className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none"
              />
              <div className="flex space-x-4 mt-4">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 py-3 px-4 bg-neum-bg text-accent-blue font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active"
                >
                  <HiOutlineClipboardCopy className="inline h-5 w-5 mr-2" />
                  {copySuccess ? 'Berhasil Disalin!' : 'Salin Teks'}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex-1 py-3 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 active:bg-green-700"
                >
                  <FaWhatsapp className="inline h-5 w-5 mr-2" />
                  Kirim ke WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <p className={`text-center mt-4 ${message.type === 'success' ? 'text-accent-green' : 'text-accent-red'}`}>
            {message.text}
          </p>
        )}
      </div>

      <Modal isOpen={isDeleteModalOpen} closeModal={() => setIsDeleteModalOpen(false)} title="Konfirmasi Hapus">
        <p className="text-gray-700">Anda yakin ingin menghapus template "{templateName}"?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-neum-bg text-gray-700 font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Batal
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-accent-red text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
            onClick={handleDelete}
          >
            Hapus
          </button>
        </div>
      </Modal>

      <Modal isOpen={isHelpOpen} closeModal={() => setIsHelpOpen(false)} title="Panduan Penggunaan Template">
        <div className="text-sm text-gray-700 space-y-4">
          <p><b>Format variabel:</b> <code>{'{{nama_variabel:"tipe"}}'}</code> atau <code>{'{{nama_variabel:"Label Kustom"}}'}</code></p>
          <div>
            <p className="font-semibold mb-1">Daftar tipe yang didukung:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><code>text</code> (default)</li>
              <li><code>number</code>, <code>email</code>, <code>tel</code>, <code>url</code></li>
              <li><code>date</code>, <code>time</code> (format 24 jam), <code>datetime-local</code>, <code>month</code>, <code>week</code></li>
              <li><code>color</code>, <code>textarea</code></li>
              <li><code>select:Opsi1|Opsi2|Opsi3</code> (contoh: <code>{'{{jurusan:"select:TI|SI|MI"}}'}</code>)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">Contoh:</p>
            <pre className="bg-white/60 p-3 rounded-md overflow-x-auto">{`Tanggal: {{tanggal:"date"}}
Pukul: {{pukul:"time"}}
Lokasi: {{lokasi:"Ruang Rapat"}}
Catatan: {{catatan:"textarea"}}
Jurusan: {{jurusan:"select:TI|SI|MI"}}`}</pre>
          </div>
          <p><b>Catatan:</b> untuk <code>time</code> gunakan format <b>HH:MM</b> (24 jam), mis. <code>13:30</code>.</p>
        </div>
        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={() => setIsHelpOpen(false)}
            className="px-4 py-2 bg-neum-bg text-accent-blue font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover"
          >
            Mengerti
          </button>
        </div>
      </Modal>

      <Modal isOpen={isSaveInfoOpen} closeModal={() => setIsSaveInfoOpen(false)} title="Template Disimpan">
        <div className="flex items-start space-x-3 text-gray-700">
          <HiCheckCircle className="mt-0.5 text-accent-green" size={22} />
          <div>
            <p className="font-semibold">Berhasil menyimpan perubahan.</p>
            <p className="text-sm opacity-80">Template “{templateName}” sudah diperbarui.</p>
          </div>
        </div>
        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={() => setIsSaveInfoOpen(false)}
            className="px-4 py-2 bg-neum-bg text-accent-green font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover"
          >
            Oke
          </button>
        </div>
      </Modal>

      <Modal isOpen={isSaveAsOpen} closeModal={() => setIsSaveAsOpen(false)} title="Simpan Sebagai Template Baru">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Nama Template Baru</label>
          <input
            type="text"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-blue"
            placeholder="Mis. Template Rapat Mingguan"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setIsSaveAsOpen(false)}
            className="px-4 py-2 bg-neum-bg text-gray-700 font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSaveAsNew}
            className="px-4 py-2 bg-neum-bg text-accent-blue font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover"
          >
            Simpan
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default BuatInformasi;