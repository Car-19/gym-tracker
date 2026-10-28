import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
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

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, gym-tracker');
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
