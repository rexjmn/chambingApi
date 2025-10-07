import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Query, 
    UseGuards,
    UseInterceptors,
    UploadedFile
  } from '@nestjs/common';
  import { DocumentsService } from './documents.service';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../../auth/guards/roles.guard';
  import { RequireRoles } from '../../auth/decorators/roles.decorator';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { CreateDocumentoDto } from './dto/create-documento.dto';
  import { UpdateDocumentoDto } from './dto/update-documento.dto';
  
  @Controller('documents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('documento'))
    async uploadDocument(
      @UploadedFile() file: Express.Multer.File,
      @Body() createDocumentoDto: CreateDocumentoDto
    ) {
      // Aquí deberías implementar la lógica para subir el archivo a tu servicio de almacenamiento
      // y obtener la URL del documento
      const urlDocumento = await this.uploadToStorage(file);
      
      return this.documentsService.create({
        ...createDocumentoDto,
        urlDocumento
      });
    }
  
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles('admin', 'super_admin', 'verificador')
    findAll(
      @Query('usuarioId') usuarioId?: string,
      @Query('tipoDocumento') tipoDocumento?: string,
      @Query('estadoVerificacion') estadoVerificacion?: string
    ) {
      return this.documentsService.findAll({
        usuarioId,
        tipoDocumento,
        estadoVerificacion
      });
    }
  
    @Get(':id')
    @RequireRoles('admin', 'super_admin', 'verificador')
    findOne(@Param('id') id: string) {
      return this.documentsService.findOne(id);
    }
  
    @Post(':id/verify')
    @RequireRoles('admin', 'super_admin', 'verificador')
    verifyDocument(
      @Param('id') id: string,
      @Body() verificationData: {
        verificadorId: string;
        resultado: 'aprobado' | 'rechazado';
        notas?: string;
      }
    ) {
      return this.documentsService.verifyDocument(
        id,
        verificationData.verificadorId,
        verificationData.resultado,
        verificationData.notas
      );
    }
  
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() updateDocumentoDto: UpdateDocumentoDto
    ) {
      return this.documentsService.update(id, updateDocumentoDto);
    }
  
    // Método privado para manejar la subida de archivos
    private async uploadToStorage(file: Express.Multer.File): Promise<string> {
      // Aquí implementarías la lógica para subir el archivo a tu servicio de almacenamiento
      // (por ejemplo, S3, Google Cloud Storage, etc.)
      // Retorna la URL del documento almacenado
      throw new Error('Método no implementado');
    }
  }