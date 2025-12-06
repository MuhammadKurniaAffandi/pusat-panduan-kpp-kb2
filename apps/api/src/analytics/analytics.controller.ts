import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DashboardStatsDto } from './dto';

@ApiTags('analytics')
@ApiBearerAuth('JWT-auth')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboardStats(
    @CurrentUser('id') userId: string | null,
    @CurrentUser('role') userRole: string | null,
  ): Promise<DashboardStatsDto> {
    return this.analyticsService.getDashboardStats(
      userId || undefined,
      userRole || undefined,
    );
  }
}
