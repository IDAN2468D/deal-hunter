// Use a dynamic import because html2pdf may try to access `window` on import
const getHtml2Pdf = async () => {
    // @ts-ignore
    const html2pdf = (await import('html2pdf.js')).default;
    return html2pdf;
};

export const exportToPdf = async (destination: string, itinerary: { day: number | string, theme?: string, tips?: string, activities: { time?: string, title: string, description?: string, location?: string }[] }[]) => {


    // Generate HTML content based on the itinerary data
    const today = new Date().toLocaleDateString('he-IL');

    let htmlContent = `
        <div style="padding: 20px; background-color: #050510; color: white; border-bottom: 4px solid #d4af37; margin-bottom: 30px;">
            <h1 style="color: #d4af37; font-size: 28px; margin: 0; padding: 0;">DEALHUNTER</h1>
            <p style="font-size: 12px; margin-top: 5px; color: #aaaaaa;">תוכנית טיול יוקרתית מונחית AI | ${today}</p>
        </div>
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 40px; color: #050510;">
            ${destination.toUpperCase()}
        </h2>
    `;

    itinerary.forEach((day) => {
        htmlContent += `
            <div style="margin-bottom: 30px; page-break-inside: avoid;">
                <div style="background-color: #f8f8f8; padding: 10px 15px; margin-bottom: 15px; border-right: 4px solid #d4af37;">
                    <h3 style="margin: 0; font-size: 18px; color: #05050a;">
                        יום ${day.day}: ${day.theme}
                    </h3>
                </div>
        `;

        if (day.tips) {
            htmlContent += `
                <div style="margin: 0 15px 15px 15px; padding: 10px; background-color: rgba(212, 175, 55, 0.1); border-radius: 5px;">
                    <span style="color: #b48c14; font-weight: bold;">טיפ קונסיירז: </span>
                    <span style="color: #555555; font-style: italic;">${day.tips}</span>
                </div>
            `;
        }

        day.activities.forEach((act: { time?: string, title: string, description?: string, location?: string }) => {
            htmlContent += `
                <div style="margin: 10px 15px 20px 15px;">
                    <div style="font-size: 14px; font-weight: bold; color: #050510; display: flex; align-items: center; gap: 10px;">
                        ${act.time ? `<span style="background-color: #eeeeee; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${act.time}</span>` : ''}
                        <span>${act.title}</span>
                    </div>
                    ${act.description ? `<p style="font-size: 12px; color: #3c3c3c; margin: 4px 0 8px 0; padding-right: 15px;">${act.description}</p>` : ''}
                    ${act.location ? `<p style="font-size: 11px; color: #787878; font-style: italic; padding-right: 15px;">מיקום: ${act.location}</p>` : ''}
                </div>
            `;
        });

        htmlContent += `</div>`;
    });

    const html2pdf = await getHtml2Pdf();

    const opt = {
        margin: 10,
        filename: `DealHunter_${destination.replace(/\s+/g, '_')}_Itinerary.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    const finalHtml = `
        <div style="font-family: 'Heebo', Arial, sans-serif; direction: rtl; padding: 20px; background-color: #ffffff; color: #171717;">
            ${htmlContent}
        </div>
    `;

    html2pdf().set(opt).from(finalHtml).save();
};
