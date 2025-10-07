// src/modules/contracts/entities/contrato.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany, 
  JoinColumn, 
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CategoriaServicio } from '../../services/entities/categoria-servicio.entity';
import { EstadoContrato } from './estado-contrato.entity';

/**
 * ESTADOS DEL CONTRATO:
 * 
 * 1. 'pendiente_activacion' → Contrato creado, esperando activación con PIN/QR
 * 2. 'activo' → PIN/QR validado, trabajo en progreso
 * 3. 'completado' → Trabajo terminado, esperando confirmación final
 * 4. 'cerrado' → Contrato finalizado, pago liberado
 * 5. 'cancelado' → Contrato cancelado antes o durante
 * 6. 'disputado' → Hay un problema que requiere mediación
 */

@Entity('contratos')
export class Contrato {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ========== PARTES DEL CONTRATO ==========
  
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'empleador_id' })
  empleador: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'trabajador_id' })
  trabajador: User;

  @ManyToOne(() => CategoriaServicio, { eager: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaServicio;

  // ========== IDENTIFICADORES ÚNICOS ==========
  
  /**
   * Código único del contrato (ej: CON-2025-12345)
   */
  @Column({ unique: true, length: 50 })
  codigo_contrato: string;

  /**
   * PIN de 6 dígitos para activación rápida
   */
  @Column({ length: 6 })
  pin_activacion: string;

  /**
   * URL del código QR para activación
   */
  @Column({ type: 'text', nullable: true })
  codigo_qr_url: string;

  // ========== FECHAS Y TIEMPOS ==========
  
  @CreateDateColumn()
  fecha_creacion: Date;

  @Column({ type: 'timestamp' })
  fecha_inicio_programada: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_fin_programada: Date;

  /**
   * Timestamp cuando se activó el contrato (escaneo QR o ingreso PIN)
   */
  @Column({ type: 'timestamp', nullable: true })
  fecha_activacion: Date;

  /**
   * Timestamp cuando se completó el trabajo
   */
  @Column({ type: 'timestamp', nullable: true })
  fecha_completado: Date;

  /**
   * Timestamp cuando se cerró definitivamente el contrato
   */
  @Column({ type: 'timestamp', nullable: true })
  fecha_cierre: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  // ========== ESTADO Y DETALLES ==========
  
  @Column({ 
    type: 'varchar', 
    length: 30,
    default: 'pendiente_activacion' 
  })
  estado: string;

  @Column({ type: 'jsonb' })
  detalles_servicio: {
    descripcion: string;
    direccion: string;
    coordenadas?: {
      lat: number;
      lng: number;
    };
    duracion_estimada_horas?: number;
    notas_adicionales?: string;
  };

  @Column({ type: 'text' })
  terminos_condiciones: string;

  // ========== INFORMACIÓN DE PAGO ==========
  
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto_total: number;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'pendiente' 
  })
  estado_pago: string; // 'pendiente', 'en_hold', 'liberado', 'reembolsado'

  /**
   * Método de pago elegido
   */
  @Column({ 
    type: 'varchar', 
    length: 20,
    default: 'efectivo'
  })
  metodo_pago: string; // 'efectivo', 'tarjeta'

  /**
   * ID del Payment Intent de Stripe (null si es efectivo)
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  stripe_payment_intent_id: string;

  /**
   * Comisión de la plataforma (%)
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 10 })
  comision_plataforma: number;

  /**
   * Monto que recibirá el trabajador después de comisión
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto_trabajador: number;

  // ========== ACTIVACIÓN DEL CONTRATO ==========
  
  /**
   * Indica quién activó el contrato (empleador o trabajador)
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  activado_por: string; // 'empleador' o 'trabajador'

  /**
   * Método de activación usado
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  metodo_activacion: string; // 'qr' o 'pin'

  /**
   * IP desde donde se activó (seguridad)
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  ip_activacion: string | null;

  // ========== RELACIONES ==========
  
  @OneToMany(() => EstadoContrato, estado => estado.contrato, {
    cascade: true
  })
  estados: EstadoContrato[];

  // ========== MÉTODOS HELPER ==========
  
  /**
   * Verifica si el contrato puede ser activado
   */
  puedeSerActivado(): boolean {
    return this.estado === 'pendiente_activacion';
  }

  /**
   * Verifica si el contrato puede ser completado
   */
  puedeSerCompletado(): boolean {
    return this.estado === 'activo';
  }

  /**
   * Verifica si el contrato puede ser cancelado
   */
  puedeSerCancelado(): boolean {
    return ['pendiente_activacion', 'activo'].includes(this.estado);
  }

  
  calcularMontoTrabajador(): number {
    const comisionMonto = this.monto_total * (this.comision_plataforma / 100);
    return this.monto_total - comisionMonto;
  }

  
  estaVencido(): boolean {
    return new Date() > new Date(this.fecha_inicio_programada) && 
           this.estado === 'pendiente_activacion';
  }
}