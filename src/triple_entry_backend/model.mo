import Principal "mo:base/Principal";
import Int64 "mo:base/Int64";
import Text "mo:base/Text";
import Time "mo:base/Time";

module model {

    /// Merepresentasikan pengguna dalam sistem.
    public type User = {
        /// ID unik pengguna, berupa Principal.
        principal: Principal; 
        /// Nama pengguna yang ditampilkan.
        username: Text; 
        /// Alamat email pengguna.
        email: Text; 
        /// Peran pengguna, misalnya "user" atau "admin".
        role: Text;  
    };

    /// Merepresentasikan akun keuangan pengguna.
    public type Account = {
        /// ID unik akun.
        id: Int64; 
        /// Pemilik akun, berupa Principal.
        owner: Principal; 
        /// Jenis akun, misalnya "asset", "liability", "equity".
        account_type: Text; 
        /// Saldo akun saat ini.
        balance: Int64; 
        /// Mata uang akun, misalnya "USD", "IDR".
        currency: Text; 
        /// Deskripsi singkat tentang akun.
        description: Text; 
    };

    /// Merepresentasikan transaksi transfer dana antar akun.
    public type Transaction = {
        /// ID unik transaksi.
        id: Int64; 
        /// Pengirim dana, berupa Principal.
        from: Principal; 
        /// Penerima dana, berupa Principal.
        to: Principal; 
        /// Jumlah dana yang ditransfer.
        amount: Int64;  
        /// Waktu transaksi dilakukan.
        timestamp: Time.Time; 
        /// Informasi tambahan tentang transaksi.
        metadata: Metadata; 
    };

    /// Merepresentasikan entri akuntansi untuk setiap transaksi.
    public type Entry = {
        /// ID unik entri.
        id: Int64;
        /// ID transaksi yang terkait dengan entri ini.
        transaction_id: Int64; 
        /// ID akun yang terpengaruh oleh entri ini.
        account_id: Int64; 
        /// Jumlah perubahan saldo pada akun (bisa positif atau negatif).
        amount: Int64; 
        /// Deskripsi entri akuntansi.
        description: Text; 
    };

    /// Merepresentasikan metadata tambahan untuk transaksi.
    public type Metadata = {
        /// Waktu transaksi dilakukan.
        timestamp: Time.Time; 
        /// Hash dari data transaksi (opsional, untuk keamanan).
        transaction_hash: Text; 
    };
}