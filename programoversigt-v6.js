class SportLiveScheduleV6 extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    position: relative;
                }

                .sl-widget, .sl-widget * { 
                    box-sizing: border-box; 
                }
                
                .sl-widget {
                    font-family: 'avenir-lt-w01_35-light1475496', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: transparent; 
                    color: #333;
                    max-width: 1000px;
                    width: 100%;
                    margin: 0 auto;
                    padding: 0 10px 20px 10px;
                }

                #sl-error-display {
                    background-color: #ffebee;
                    color: #c62828;
                    padding: 15px;
                    border-radius: 5px;
                    border: 1px solid #ef9a9a;
                    margin-top: 20px;
                    display: none;
                    text-align: center;
                }

                /* LØSNINGEN: Ren CSS sticky. JS fjerner nu WIX's begrænsninger udefra */
                #sl-selector-container {
                    background-color: #2b2b2b; 
                    padding-top: 15px; 
                    padding-bottom: 15px; 
                    width: 100%;
                    position: -webkit-sticky;
                    position: sticky;
                    
                    /* Desktop højde for jeres WIX-header */
                    top: 116px; 
                    z-index: 9999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.6);
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }

                .sl-date-selector {
                    background-color: #e0e0e0;
                    padding: 12px 15px;
                    margin: 0; 
                    border: none;
                    border-left: 5px solid #dd5f12;
                    border-radius: 4px;
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #333;
                    width: 100%;
                    cursor: pointer;
                    font-family: inherit;
                    outline: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    appearance: none; 
                    -webkit-appearance: none; 
                    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dd5f12'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 15px center; 
                    background-size: 35px; 
                    padding-right: 50px; 
                }

                .sl-date-selector:focus {
                    box-shadow: 0 2px 8px rgba(221, 95, 18, 0.4);
                }

                .sl-program-card {
                    background: white;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    display: flex;
                    flex-wrap: wrap;
                    align-items: flex-start;
                    border-left: 5px solid transparent;
                    transition: transform 0.2s, box-shadow 0.2s;
                    width: 100%;
                    cursor: pointer;
                    position: relative;
                }

                .sl-program-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                }

                .sl-status-live { border-left-color: #e74c3c; } 
                .sl-status-repeat { border-left-color: #95a5a6; }
                .sl-status-premiere { border-left-color: #f1c40f; }
                .sl-status-relive { border-left-color: #ef867b; } 

                .sl-time-col {
                    flex: 0 0 80px;
                    font-weight: bold;
                    font-size: 1.2em;
                    color: #555;
                    text-align: center;
                    padding-top: 2px;
                }

                .sl-content-col {
                    flex: 1;
                    padding: 0 15px;
                    min-width: 250px;
                }

                .sl-genre {
                    font-size: 0.8em;
                    text-transform: uppercase;
                    color: #888;
                    letter-spacing: 1px;
                    margin-bottom: 2px;
                    font-weight: bold;
                }

                .sl-title {
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #dd5f12;
                    margin: 0;
                }

                .sl-episode {
                    font-weight: 500;
                    color: #444;
                    margin: 2px 0;
                }

                .sl-description {
                    font-size: 0.9em;
                    color: #666;
                    margin-top: 5px;
                    line-height: 1.4;
                }

                .sl-long-description {
                    display: none;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #eee;
                    animation: fadeIn 0.3s ease-in-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .sl-program-card.expanded .sl-long-description {
                    display: flex;
                    gap: 15px;
                    align-items: flex-start;
                }

                .sl-program-thumbnail {
                    width: 140px;
                    height: auto;
                    border-radius: 6px;
                    flex-shrink: 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .sl-long-description-text {
                    font-size: 0.9em; 
                    color: #333;
                    line-height: 1.5;
                }

                .sl-status-badge {
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 0.8em;
                    font-weight: bold;
                    text-transform: uppercase;
                    color: white;
                    white-space: nowrap;
                    margin-right: 25px;
                }

                .sl-bg-live { background-color: #e74c3c; } 
                .sl-bg-premiere { background-color: #f39c12; }
                .sl-bg-repeat { display: none; } 
                .sl-bg-relive { background-color: #ef867b; } 

                .sl-expand-icon {
                    position: absolute;
                    right: 15px;
                    top: 20px;
                    width: 10px;
                    height: 10px;
                    border-right: 2px solid #ccc;
                    border-bottom: 2px solid #ccc;
                    transform: rotate(45deg);
                    transition: transform 0.3s;
                }

                .sl-program-card.expanded .sl-expand-icon {
                    transform: rotate(-135deg);
                    border-color: #dd5f12;
                }

                @media (max-width: 768px) {
                    #sl-selector-container {
                        /* Mobil højde for jeres WIX-header */
                        top: 80px; 
                    }
                }

                @media (max-width: 600px) {
                    .sl-program-card { flex-direction: column; align-items: flex-start; }
                    .sl-time-col { flex: 0 0 auto; margin-bottom: 8px; text-align: left; } 
                    .sl-content-col { padding: 0; margin-bottom: 10px; }
                    .sl-status-badge { align-self: flex-start; margin-right: 0; margin-bottom: 10px; margin-top: 8px; }
                    .sl-expand-icon { top: 15px; right: 15px; }
                    .sl-program-card.expanded .sl-long-description { flex-direction: column; }
                    .sl-program-thumbnail { width: 100%; max-width: 250px; }
                }
            </style>

            <div class="sl-widget">
                <div id="sl-error-display"></div>
                <div id="sl-selector-container"></div>
                <div id="sl-schedule-container">
                    <p id="sl-loading-text" style="text-align: center; font-size: 1.2em; color: #ffffff;">Henter seneste programdata...</p>
                </div>
            </div>
        `;

        this.initWidget();
        this.unlockWixSticky();
    }

    // Det nye script, der kravler op i WIX og fjerner blokeringer!
    unlockWixSticky() {
        // Vi venter 1,5 sekund for at sikre, at WIX har bygget hele siden færdig
        setTimeout(() => {
            let parent = this.parentElement;
            
            // Vi går op gennem HTML-strukturen én kasse ad gangen
            while (parent && parent !== document.body && parent !== document.documentElement) {
                try {
                    const style = window.getComputedStyle(parent);
                    
                    // Hvis en WIX-kasse skjuler overløb, åbner vi den!
                    if (style.overflow === 'hidden' || style.overflow === 'clip' || style.overflowY === 'hidden') {
                        parent.style.setProperty('overflow', 'visible', 'important');
                    }
                    
                    // Hvis en WIX-kasse bruger transform (hvilket dræber sticky), slukker vi for det!
                    if (style.transform && style.transform !== 'none') {
                        parent.style.setProperty('transform', 'none', 'important');
                    }
                    
                    // Gå et niveau højere op
                    parent = parent.parentElement;
                } catch (e) {
                    break;
                }
            }
        }, 1500);
    }

    initWidget() {
        const container = this.querySelector('#sl-schedule-container');
        const loadingText = this.querySelector('#sl-loading-text');
        const errorDisplay = this.querySelector('#sl-error-display');
        const selectorContainer = this.querySelector('#sl-selector-container');

        const XML_URL = 'https://sportlivedk.github.io/programoversigt/sportlive_program.xml';
        const urlWithCacheBuster = `${XML_URL}?t=${new Date().getTime()}`;

        fetch(urlWithCacheBuster)
            .then(response => {
                if (!response.ok) { throw new Error(`Kunne ikke hente XML filen (${response.status} ${response.statusText}).`); }
                return response.text();
            })
            .then(xmlString => {
                this.processXML(xmlString, container, loadingText, errorDisplay, selectorContainer);
            })
            .catch(error => {
                if (loadingText) loadingText.style.display = 'none';
                errorDisplay.style.display = 'block';
                errorDisplay.textContent = "Fejl: " + error.message;
            });
    }

    processXML(xmlString, container, loadingText, errorDisplay, selectorContainer) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");
            const events = Array.from(xmlDoc.getElementsByTagName('Event'));

            if (events.length === 0) throw new Error("XML-filen indeholder ingen programmer.");

            const now = new Date();
            const currentBroadcastDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (now.getHours() < 6) currentBroadcastDate.setDate(currentBroadcastDate.getDate() - 1);
            const currentBroadcastTimestamp = currentBroadcastDate.getTime();

            if (loadingText) loadingText.style.display = 'none';

            const groupedEvents = {};
            const uniqueDates = [];
            let hasFutureEvents = false;

            events.forEach(event => {
                const rawDate = this.getTagValue(event, 'Date');
                const time = this.getTagValue(event, 'StartTime');
                const broadcastDateObj = this.getBroadcastDate(rawDate, time);

                if (broadcastDateObj.getTime() < currentBroadcastTimestamp) return;

                hasFutureEvents = true;

                const parsedEvent = {
                    genre: this.getTagValue(event, 'PrimaryGenre'),
                    title: this.getTagValue(event, 'Title'),
                    epTitle: this.getTagValue(event, 'EpisodeTitle'),
                    status: this.getTagValue(event, 'Status'),
                    desc: this.getTagValue(event, 'ShortDescription'),
                    longDesc: this.getTagValue(event, 'LongDescription'),
                    stillUrl: this.getTagValue(event, 'StillSceneUrl'),
                    time: time,
                    broadcastDateObj: broadcastDateObj,
                    broadcastDateString: this.formatDateStandard(broadcastDateObj)
                };

                const dateStr = parsedEvent.broadcastDateString;

                if (!groupedEvents[dateStr]) {
                    groupedEvents[dateStr] = { dateObj: broadcastDateObj, eventsList: [] };
                    uniqueDates.push(dateStr);
                }

                groupedEvents[dateStr].eventsList.push(parsedEvent);
            });

            if (!hasFutureEvents) {
                container.innerHTML = "<p style='text-align: center; color: #ffffff; margin-top: 20px;'>Ingen aktuelle programmer i oversigten.</p>";
                return;
            }

            const selectElement = document.createElement('select');
            selectElement.className = 'sl-date-selector';

            uniqueDates.forEach(dateStr => {
                const dateObj = groupedEvents[dateStr].dateObj;
                const dayName = new Intl.DateTimeFormat('da-DK', { weekday: 'long' }).format(dateObj);
                const monthName = new Intl.DateTimeFormat('da-DK', { month: 'long' }).format(dateObj);
                const day = dateObj.getDate();
                const optionText = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} d. ${day}. ${monthName}`;
                
                const option = document.createElement('option');
                option.value = dateStr;
                option.textContent = optionText;
                selectElement.appendChild(option);
            });

            selectorContainer.appendChild(selectElement);

            const renderDay = (selectedDateStr) => {
                container.innerHTML = ''; 
                const dayEvents = groupedEvents[selectedDateStr].eventsList;

                dayEvents.forEach(pe => {
                    const card = document.createElement('div');
                    card.className = `sl-program-card sl-status-${pe.status.toLowerCase()}`;

                    card.addEventListener('click', () => {
                        const isExpanded = card.classList.contains('expanded');
                        const allExpanded = container.querySelectorAll('.sl-program-card.expanded');
                        allExpanded.forEach(c => c.classList.remove('expanded'));
                        if (!isExpanded) card.classList.add('expanded');
                    });

                    let longDescContent = '';
                    if (pe.stillUrl) longDescContent += `<img src="${pe.stillUrl}" class="sl-program-thumbnail">`;
                    if (pe.longDesc) longDescContent += `<div class="sl-long-description-text">${pe.longDesc}</div>`;

                    let displayStatus = pe.status; 
                    if (pe.status.toLowerCase() === 'live') displayStatus = 'Direkte';
                    else if (pe.status.toLowerCase() === 'relive') displayStatus = 'Forskudt';

                    card.innerHTML = `
                        <div class="sl-time-col">${pe.time}</div>
                        <div class="sl-content-col">
                            ${pe.genre ? `<div class="sl-genre">${pe.genre}</div>` : ''}
                            <div class="sl-title">${pe.title}</div>
                            ${pe.epTitle ? `<div class="sl-episode">${pe.epTitle}</div>` : ''}
                            ${pe.desc ? `<div class="sl-description">${pe.desc}</div>` : ''}
                            <div class="sl-long-description">${longDescContent}</div>
                        </div>
                        <div class="sl-status-badge sl-bg-${pe.status.toLowerCase()}">${displayStatus}</div>
                        <div class="sl-expand-icon"></div>
                    `;
                    container.appendChild(card);
                });
            };

            selectElement.addEventListener('change', (e) => renderDay(e.target.value));
            renderDay(uniqueDates[0]);

        } catch (innerError) {
            if (loadingText) loadingText.style.display = 'none';
            errorDisplay.style.display = 'block';
            errorDisplay.textContent = "Fejl: " + innerError.message;
        }
    }

    getTagValue(parent, tagName) {
        const element = parent.getElementsByTagName(tagName)[0];
        return element ? element.textContent : '';
    }

    getBroadcastDate(dateStr, timeStr) {
        const [day, month, year] = dateStr.split('/').map(Number);
        const [hour, minute] = timeStr.split(':').map(Number);
        const dateObj = new Date(year, month - 1, day);
        if (hour < 6) dateObj.setDate(dateObj.getDate() - 1);
        return dateObj;
    }

    formatDateStandard(dateObj) {
        const d = String(dateObj.getDate()).padStart(2, '0');
        const m = String(dateObj.getMonth() + 1).padStart(2, '0'); 
        return `${d}/${m}/${dateObj.getFullYear()}`;
    }
}

// NYT TAG NAVN HER
customElements.define('sport-live-schedule-v6', SportLiveScheduleV6);