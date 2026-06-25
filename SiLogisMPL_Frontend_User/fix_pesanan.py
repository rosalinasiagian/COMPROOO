import re

with open("src/pages/Pesanan.jsx", "r") as f:
    content = f.read()

# 1. Update PesananBerlangsung signature and state
content = re.sub(
    r'const PesananBerlangsung = \(\) => \{\n\s*const \[statusStep, setStatusStep\] = useState\(1\);',
    r'''const PesananBerlangsungList = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-in fade-in py-20">
        <Package className="w-32 h-32 text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tidak ada pesanan berlangsung</h2>
        <p className="text-gray-500">Silahkan buat pesanan baru.</p>
      </div>
    );
  }
  return <div className="space-y-16">{orders.map(o => <PesananBerlangsung key={o.id} order={o} />)}</div>;
};

const PesananBerlangsung = ({ order }) => {
  let statusStep = 1;
  if (order?.status === 'PENDING') statusStep = 1;
  else if (order?.status === 'ACCEPT' || order?.status === 'Diproses') statusStep = 2;
  else statusStep = 3;
''',
    content
)

# Replace the hardcoded MPL-20240905-0822
content = content.replace('MPL-20240905-0822', '{order?.orderNumber || "MPL-DEMO"}')
content = content.replace('MPL-992831', '{order?.orderNumber || "MPL-DEMO"}')
content = content.replace('LOG-8829', '{order?.orderNumber || "LOG-DEMO"}')

# Replace Suku Cadang Alat Berat (Excavator)
content = content.replace('Suku Cadang Alat Berat <br className="hidden md:block" /> (Excavator)', '{order?.jenisPaket || "Barang"}')
content = content.replace('Suku Cadang Alat Berat (450 Kg)', '{order?.jenisPaket} ({order?.totalBerat} Kg)')
content = content.replace('Suku Cadang Alat Berat (Excavator)', '{order?.jenisPaket}')
content = content.replace('Sparepart Otomotif & Mesin', '{order?.jenisPaket}')

# Replace berat
content = content.replace('Total Berat: 450 Kg | 2 Pallet', 'Total Berat: {order?.totalBerat} Kg | {order?.totalPaket} Paket')
content = content.replace('2.450', '{order?.totalBerat}')
content = content.replace('4.000 Kg', '{order?.kapasitas} Kg')

# Replace tujuan
content = content.replace('Gudang Logistik Sektor B', '{order?.namaPenerima}')
content = content.replace('Samarinda, Kalimantan Timur', '{order?.alamatTujuan}')
content = content.replace('Gudang Utama MPL - Surabaya', '{order?.alamatAsal}')
content = content.replace('Gudang Logistik Sektor B - Samarinda', '{order?.alamatTujuan}')
content = content.replace('PT AKU CINTA KAMU', '{order?.namaPengirim}')
content = content.replace('DONI SIHOMBING', '{order?.picPengirim}')
content = content.replace('083345627189', '{order?.nomorTeleponPengirim}')
content = content.replace('PT AKU TOLAK KAMU', '{order?.namaPenerima}')
content = content.replace('RISTI SITUMEANG', '{order?.picPenerima}')
content = content.replace('089976543215', '{order?.nomorTeleponPenerima}')

# Remove demo status buttons
content = re.sub(
    r'<div className="absolute -top-12 right-0 flex gap-2">[\s\S]*?</div>',
    '',
    content
)

# 2. Update HistoryPesanan signature and state
content = re.sub(
    r'const HistoryPesanan = \(\) => \{\n\s*const \[viewDetail, setViewDetail\] = useState\(false\);\n\s*const \[isEmpty, setIsEmpty\] = useState\(false\);',
    r'''const HistoryPesananList = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-in fade-in py-20">
        <Package className="w-32 h-32 text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
        <p className="text-gray-500">Belum ada riwayat pesanan.</p>
      </div>
    );
  }
  return <div className="space-y-16">{orders.map(o => <HistoryPesanan key={o.id} order={o} />)}</div>;
};

const HistoryPesanan = ({ order }) => {
  const [viewDetail, setViewDetail] = useState(false);
''',
    content
)

# Remove the old isEmpty check block in HistoryPesanan
content = re.sub(
    r'if \(isEmpty\) \{[\s\S]*?\}\n\n\s*if \(viewDetail\)',
    'if (viewDetail)',
    content
)

# 3. Update App rendering
content = content.replace(
    '<PesananBerlangsung />',
    '<PesananBerlangsungList orders={orders?.filter(o => o.status !== "DONE" && o.status !== "SELESAI")} />'
)
content = content.replace(
    '<HistoryPesanan />',
    '<HistoryPesananList orders={orders?.filter(o => o.status === "DONE" || o.status === "SELESAI")} />'
)

with open("src/pages/Pesanan.jsx", "w") as f:
    f.write(content)

