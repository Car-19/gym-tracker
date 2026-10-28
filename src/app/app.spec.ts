import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('shows only the calendar and weekly activity summary on Inicio', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.activity-calendar')).toBeTruthy();
    expect(compiled.querySelector('.home-summary-compact')).toBeTruthy();
    expect(compiled.querySelector('.home-summary-chart')).toBeTruthy();
    expect(compiled.querySelector('.muscle-grid')).toBeNull();
    expect(compiled.querySelector('.sessions-section')).toBeNull();
    expect(compiled.querySelector('.progress-panel')).toBeNull();
  });

  it('shows the session history only on Entrenar', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.ejercicios['Pecho'][0].historial.push({
      fecha: new Date('2026-10-14T12:00:00'),
      peso: 40,
      repeticiones: 10,
    });

    expect(app.obtenerSesiones()).toHaveLength(1);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sessions-section')).toBeNull();

    const navigationButtons = fixture.nativeElement.querySelectorAll('.bottom-nav button');
    navigationButtons[2].click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sessions-section')).toBeNull();

    navigationButtons[1].click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sessions-section')).toBeTruthy();
  });

  it('should allow saving a new weight after the previous value is cleared', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const registro = {
      fecha: new Date('2026-10-14T12:00:00'),
      peso: 40,
      repeticiones: 10,
    };

    app.iniciarEdicion(registro);
    app.pesoEdicionTexto = null;
    expect(app.esEdicionValida()).toBe(false);

    app.pesoEdicionTexto = '45';
    expect(app.esEdicionValida()).toBe(true);

    app.guardarEdicionRegistro();
    expect(registro.peso).toBe(45);
  });
});
