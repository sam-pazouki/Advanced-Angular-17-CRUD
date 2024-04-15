/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { Row, Style, Workbook, Worksheet } from "exceljs";
import { saveAs } from "file-saver";

import { SPREADSHEET_FORMAT } from "./spreadsheet.format";

export interface XcelHeaderCell {
  data: string | number;
  width?: number;
  style?: Partial<Style>;
}

export interface CreateXslxDto {
  worksheetName?: string;
  title: string;
  headers: XcelHeaderCell[];
  data: any; // any only primitive types
}

enum ExcelErrorStatusCode {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}

export class ExcelError extends Error {
  statusCode!: number;

  constructor(dto: { message: string; statusCode: ExcelErrorStatusCode }) {
    super(dto.message);
    this.name = "ExportAsExcel";
    this.statusCode = dto.statusCode;
  }
}

@Injectable({ providedIn: "root" })
export class XcelService<V> {
  constructor() {
  }

  private _workbook!: Workbook;
  private _worksheet!: Worksheet;
  private _title!: string;
  private _headerRowItems: (string | number)[] = [];
  private _headerRowWidths: number[] = [];
  private _headerRowStyles: Partial<Style>[] = [];
  private _dataRowsItems: V[][] = [];
  private _maxColLetterForHeaderAndFooterTable = "F";

  /**
   *
   * @param dto : { worksheetName, title, headers, data }
   * @desc in order to use this method you need to provide arguments with the same shape as dto
   *
   */
  exportToExcel(dto: CreateXslxDto, columnNumber: number[], callback?: () => void): void {
    this.initWorkbookAndWorksheet(dto);

    // this.addWorksheetTitle();

    this.insertHeaderRowAndCells();

    this.insertAllRowsWithData(columnNumber);

    // this.generateFooterRow();

    this._workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: SPREADSHEET_FORMAT });
      saveAs(blob, this._title + ".xlsx");
      this.resetWorkbookAndWorksheet();
      callback?.();
    });
  }

  private initWorkbookAndWorksheet(dto: CreateXslxDto): void {
    this._title = dto.title;
    if (!Array.isArray(dto.data[0])) {
      throw new ExcelError({
        statusCode: 400,
        message: "No data array was provided",
      });
    }
    const maxColLength = dto.data[0].length - 1;
    if (maxColLength <= 26) {
      // max to letter "Z" (alphabets length)
      this._maxColLetterForHeaderAndFooterTable = this.getLetterByIndex(maxColLength);
    }
    this._headerRowItems = dto.headers.map((header) => header.data.toString().toUpperCase());

    dto.headers.forEach((header) => {
      if (header.width) {
        this._headerRowWidths.push(header.width);
      }

      if (header.style) {
        this._headerRowStyles.push(header.style);
      }
    });

    this._dataRowsItems = dto.data;

    this._workbook = new Workbook();
    const worksheetName = dto.worksheetName ? dto.worksheetName : dto.title;

    this._worksheet = this._workbook.addWorksheet(worksheetName, {
      properties: {
        defaultRowHeight: 20,
      },
    });
  }

  private addWorksheetTitle(): void {
    this._worksheet.mergeCells("A1", `${this._maxColLetterForHeaderAndFooterTable}2`);

    const titleCell = this._worksheet.getCell("A1");
    titleCell.value = this._title.toUpperCase();
    titleCell.style = {
      font: {
        name: "Calibri",
        color: { argb: "FFFFFF" },
        size: 12,
        bold: true,
      },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "000" },
      },
      alignment: { vertical: "middle", horizontal: "left" },
    };
  }

  headerRow!: Row;
  private insertHeaderRowAndCells(): void {
    const headerRow = this._worksheet.addRow(this._headerRowItems);
    this.headerRow = headerRow;
    headerRow.eachCell((cell: any, colNumber: any) => {
      cell.style = {
        font: {
          name: "Calibri",
          bold: true,
          color: { argb: "FFFFFF" },
          size: 10,
        },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "000" },
        },
        alignment: { vertical: "middle", horizontal: "center" },
      };

      const headerColumn = this._worksheet.getColumn(colNumber);
      const width = this._headerRowWidths[colNumber - 1];
      const styles = this._headerRowStyles[colNumber - 1];

      // this._worksheet.getRow(3).height = 25;
      headerColumn.width = width ?? 20;

      if (styles) {
        headerColumn.style = styles;
      }
    });
  }

  private insertAllRowsWithData(columnNumber: number[]): void {
    this._dataRowsItems.forEach((data: V[]) => {
      this.createDataRowAndCells(data, columnNumber);
    });
  }

  private createDataRowAndCells(data: V[], columnNumber: number[]): void {
    const createdRow = this._worksheet.addRow(data);
    createdRow.getCell(1).alignment = { wrapText: true };


    data?.forEach((i, index) => {
      const data: any = i;
      if (i instanceof Date || Object.prototype.toString.call(i) === '[object Date]') {
        createdRow.eachCell((cell: any, cellIndex: any) => {
          if (cell.value === data) {
            cell.style.numFmt = 'dd-MM-yyyy';
          }
        });
      }

      if (typeof i === 'number') {
        createdRow.eachCell((cell: any, cellIndex: any) => {
          if (cell.value === data) {
              cell.style.numFmt = "#" + (",") + "##0";
              cell.style.numFmt = cell.style.numFmt + (".");
              cell.style.numFmt = cell.style.numFmt + "00";
            }
        });
      }
    })
  }

  private generateFooterRow(): void {
    const footerText = `${this._title}`;

    const footerRow = this._worksheet.addRow([footerText]);
    const footerCell = this._worksheet.getCell(`A${footerRow.number}`);

    footerCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "000" },
    };

    footerCell.font = {
      name: "Calibri",
      color: { argb: "FFFFFF" },
      size: 11,
    };

    footerCell.alignment = { vertical: "middle", horizontal: "left" };

    const lastCell =
      this._maxColLetterForHeaderAndFooterTable + (footerRow.number + 1).toString();
    this._worksheet.mergeCells(`A${footerRow.number}:${lastCell}`);
  }

  protected resetWorkbookAndWorksheet(): void {
    this._title = "";
    this._headerRowItems = [];
    this._headerRowWidths = [];
    this._headerRowStyles = [];
    this._dataRowsItems = [];
    this._maxColLetterForHeaderAndFooterTable = "";
  }

  /**
   *
   * @param index starts from 0 = A;
   * @FYI alphabetsLength = 26
   *
   */
  protected getLetterByIndex(index: number): string {
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabets[index];
  }
}
