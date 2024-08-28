document.addEventListener('DOMContentLoaded', () => {
    fetch('csvjson.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('search-button').addEventListener('click', () => {
                const query = document.getElementById('search-input').value.toLowerCase();
                const resultsContainer = document.getElementById('results-container');
                
                resultsContainer.innerHTML = '';
                
                const filteredArchives = data.filter(item => item.Kategori === 'Arkiv' && item.arkiv_tittel.toLowerCase().includes(query));
                
                filteredArchives.forEach(archive => {
                    const archiveElement = document.createElement('div');
                    archiveElement.classList.add('archive');
                    archiveElement.innerHTML = `
                        <h2>${archive.arkiv_tittel}</h2>
                        <button class="toggle-series" data-archive-id="${archive.arkiv_id}">Vis katalog</button>
                        <div class="series-container" style="display:none;"></div>
                    `;
                    resultsContainer.appendChild(archiveElement);
                });

                document.querySelectorAll('.toggle-series').forEach(button => {
                    button.addEventListener('click', function() {
                        const archiveId = this.getAttribute('data-archive-id');
                        const seriesContainer = this.nextElementSibling;
                        
                        if (seriesContainer.style.display === 'none') {
                            seriesContainer.style.display = 'block';
                            
                            const series = data.filter(item => item.Kategori === 'Serie' && item.arkiv_id === archiveId);
                            series.forEach(serie => {
                                const serieElement = document.createElement('div');
                                serieElement.classList.add('serie');
                                serieElement.innerHTML = `
                                    <h3>${serie.serie_tittel}</h3>
                                    <button class="toggle-pieces" data-serie-id="${serie.serie_id}">Vis stykker</button>
                                    <div class="pieces-container" style="display:none;"></div>
                                `;
                                seriesContainer.appendChild(serieElement);
                            });

                            document.querySelectorAll('.toggle-pieces').forEach(button => {
                                button.addEventListener('click', function() {
                                    const serieId = this.getAttribute('data-serie-id');
                                    const piecesContainer = this.nextElementSibling;

                                    if (piecesContainer.style.display === 'none') {
                                        piecesContainer.style.display = 'block';

                                        // Extracting pieces using full_sti to match series
                                        const pieces = data.filter(item => item.Kategori === 'Stykke' && item.full_sti.startsWith(`${archiveId}/${serieId}`));
                                        pieces.forEach(piece => {
                                            const pieceElement = document.createElement('div');
                                            pieceElement.classList.add('piece');
                                            pieceElement.innerHTML = `
                                                <p>${piece.beskrivelse_arkivskaper}</p>
                                                <p>Year: ${piece[""]}</p>
                                                <a href="${piece.lenke}" class="${piece.digitalisert ? 'btn-green' : 'btn-gray'}">${piece.digitalisert ? 'Les' : 'Bestill innsyn'}</a>
                                            `;
                                            piecesContainer.appendChild(pieceElement);
                                        });
                                    } else {
                                        piecesContainer.style.display = 'none';
                                    }
                                });
                            });
                        } else {
                            seriesContainer.style.display = 'none';
                        }
                    });
                });
            });
        })
        .catch(error => console.error('Error loading the JSON file:', error));
});
