import { Component, inject } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [ProgressSpinner],
  template: `
    @if (loading.isLoading()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <p-progressspinner
          strokeWidth="4"
          ngClass="w-16 h-16"
          animationDuration=".8s"
        />
      </div>
    }
  `,
})
export class AppLoader {
  loading = inject(LoadingService);
}
