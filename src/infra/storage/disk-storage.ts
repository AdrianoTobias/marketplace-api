import {
  Uploader,
  UploadParams,
} from '@/domain/marketplace/application/storage/uploader'

import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

@Injectable()
export class DiskStorage implements Uploader {
  private uploadDir = ''

  constructor(private envService: EnvService) {
    this.uploadDir = envService.get('UPLOAD_DIR')
  }

  async upload({ fileName, body }: UploadParams): Promise<{ path: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`
    const filePath = join(this.uploadDir, uniqueFileName)

    await fs.writeFile(filePath, body)

    return {
      path: uniqueFileName,
    }
  }
}
