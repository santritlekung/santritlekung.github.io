function renderQuote() {
    const quotes = [
        { ayat: 'Sesungguhnya bersama kesulitan ada kemudahan.', surat: 'QS. Al-Insyirah: 6' },
        { ayat: 'Dan barangsiapa yang bertakwa kepada Allah, niscaya Dia akan memberikan jalan keluar baginya.', surat: 'QS. Ath-Thalaq: 2' },
        { ayat: 'Sesungguhnya Allah tidak akan mengubah keadaan suatu kaum sampai mereka mengubah diri mereka sendiri.', surat: 'QS. Ar-Ra\'d: 11' },
        { ayat: 'Dan mintalah pertolongan (kepada Allah) dengan sabar dan salat.', surat: 'QS. Al-Baqarah: 45' },
        { ayat: 'Sesungguhnya shalat itu mencegah dari perbuatan keji dan mungkar.', surat: 'QS. Al-Ankabut: 45' }
    ];
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    const html = `
        <div style="text-align:center; padding:2rem 1rem;">
            <i class="fas fa-quote-right" style="font-size:2rem; color:#facc15; opacity:0.5;"></i>
            <blockquote style="font-size:1.4rem; font-style:italic; margin:1rem 0; color:#1e293b;">"${random.ayat}"</blockquote>
            <p style="color:#64748b;">— ${random.surat}</p>
        </div>
    `;
    document.getElementById('pageContent').innerHTML = html;
}