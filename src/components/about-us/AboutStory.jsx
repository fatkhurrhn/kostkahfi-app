export default function AboutStory() {
    return (
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                    Cerita Kami
                </h2>
                <div className="space-y-4 text-gray-600 text-justify">
                    <p>
                        Berdiri sejak 2015, Kost Al Kahfi hadir sebagai solusi akomodasi nyaman, aman, dan terjangkau bagi mahasiswa maupun pekerja di kawasan Depok dan sekitarnya.
                    </p>
                    <p>
                        Dengan lingkungan yang bersih, fasilitas yang terus diperbarui, serta suasana yang kondusif, kami berkomitmen memberikan pengalaman hunian yang mendukung produktivitas sekaligus menghadirkan kenyamanan layaknya di rumah sendiri.
                    </p>
                    <p>
                        Dukungan keamanan 24 jam, akses mudah ke transportasi umum, serta kedekatan dengan kampus dan pusat perbelanjaan menjadi nilai tambah yang membuat Kost Al Kahfi menjadi pilihan ideal.
                    </p>
                </div>
            </div>
            <div className="bg-gray-200 rounded-xl h-80 w-full overflow-hidden">
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <img src="https://res.cloudinary.com/dbssvz2pe/image/upload/v1754549473/assets-gallery/qp20cbsbmoditxz41433rqnfp.png" alt="Kost Al Kahfi" />
                </div>
            </div>
        </div>
    );
}