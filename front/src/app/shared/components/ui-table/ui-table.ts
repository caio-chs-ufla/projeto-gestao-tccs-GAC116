import { Component, contentChild, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TableModule } from 'primeng/table';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  type?: 'text' | 'link';
  linkLabel?: string;
}

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [TableModule, NgTemplateOutlet],
  template: `
    <p-table
      [value]="data()"
      [columns]="columns()"
      [loading]="loading()"
      [paginator]="paginator()"
      [rows]="rows()"
      [rowsPerPageOptions]="[10, 25, 50]"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Exibindo {first}–{last} de {totalRecords} registros"
      styleClass="p-datatable-striped p-datatable-gridlines"
    >
      <ng-template pTemplate="header" let-columns>
        <tr>
          @for (col of columns; track col.field) {
            <th [pSortableColumn]="col.sortable ? col.field : ''">
              {{ col.header }}
              @if (col.sortable) {
                <p-sortIcon [field]="col.field" />
              }
            </th>
          }
          @if (rowActionsTemplate()) {
            <th class="w-28 text-center">Ações</th>
          }
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-row let-columns="columns">
        <tr>
          @for (col of columns; track col.field) {
            <td>
              @if (col.type === 'link') {
                @if (row[col.field]) {
                  <a
                    [href]="row[col.field]"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <i class="pi pi-external-link text-xs"></i>
                    {{ col.linkLabel ?? 'Abrir' }}
                  </a>
                } @else {
                  <span class="text-gray-400">-</span>
                }
              } @else {
                {{ row[col.field] ?? '-' }}
              }
            </td>
          }
          @if (rowActionsTemplate()) {
            <td class="text-center">
              <ng-container
                [ngTemplateOutlet]="rowActionsTemplate()!"
                [ngTemplateOutletContext]="{ $implicit: row }"
              />
            </td>
          }
        </tr>
      </ng-template>

      <ng-template pTemplate="emptymessage" let-columns>
        <tr>
          <td
            [attr.colspan]="columns.length + (rowActionsTemplate() ? 1 : 0)"
            class="text-center py-6 text-gray-400"
          >
            Nenhum registro encontrado.
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class UiTable {
  columns = input<TableColumn[]>([]);
  data = input<any[]>([]);
  loading = input<boolean>(false);
  paginator = input<boolean>(true);
  rows = input<number>(10);

  rowActionsTemplate = contentChild<TemplateRef<any>>('rowActions');
}
