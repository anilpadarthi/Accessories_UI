import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


@Injectable({
    providedIn: "root",
})
export class DownloadService {

    EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    EXCEL_EXTENSION = '.xlsx';

    constructor() { }

    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        console.log('worksheet', worksheet);
        const workbook: XLSX.WorkBook = {
            Sheets: { data: worksheet },
            SheetNames: ['data'],
        };
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: this.EXCEL_TYPE
        });
        console.log(data);
        FileSaver.saveAs(data, 'orderList' + this.EXCEL_EXTENSION);
    }

    async DownloadDocument(blobData: any, fileUrl: any) {
        let data = blobData as HttpResponse<Blob>;
        console.log(data);
        const downloadedFile = new Blob([data.body as BlobPart], {
            type: 'application/octet-stream' //data.body?.type
        });
        console.log("ddd", downloadedFile)
        if (downloadedFile.type != "") {
            const a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            a.download = fileUrl;
            a.href = URL.createObjectURL(downloadedFile);
            a.target = '_blank';
            a.click();
            document.body.removeChild(a);
        }
    }

    public downloadasPdf(res){
        let blob: Blob = res as Blob;
        let url = window.URL.createObjectURL(blob);

        let anchor = document.createElement('a');
        anchor.download = 'testDoc';
        anchor.href = url;
        anchor.click();
    }



}
