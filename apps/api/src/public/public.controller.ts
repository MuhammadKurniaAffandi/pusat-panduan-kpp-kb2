import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import type { Request } from 'express';
import { PublicService } from './public.service';
import { PageType } from '@prisma/client';

@ApiTags('public')
@Controller('public') // ✅ Ini benar, jangan diubah
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get semua categories (public)' })
  @ApiResponse({ status: 200, description: 'Daftar categories' })
  async getCategories() {
    return this.publicService.getCategories();
  }

  @Get('categories/:slug')
  @ApiOperation({ summary: 'Get articles by category slug (public)' })
  @ApiResponse({ status: 200, description: 'Category dengan articles' })
  @ApiResponse({ status: 404, description: 'Category tidak ditemukan' })
  async getArticlesByCategory(@Param('slug') slug: string) {
    return this.publicService.getArticlesByCategory(slug);
  }

  @Get('articles/popular')
  @ApiOperation({ summary: 'Get popular articles (public)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Popular articles' })
  async getPopularArticles(@Query('limit') limit?: number) {
    return this.publicService.getPopularArticles(limit || 5);
  }

  @Get('articles/recent')
  @ApiOperation({ summary: 'Get recent articles (public)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Recent articles' })
  async getRecentArticles(@Query('limit') limit?: number) {
    return this.publicService.getRecentArticles(limit || 5);
  }

  @Get('articles/search')
  @ApiOperation({ summary: 'Search articles (public)' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchArticles(
    @Query('q') query: string,
    @Query('limit') limit?: number,
  ) {
    return this.publicService.searchArticles(query, limit || 10);
  }

  @Get('articles/:slug')
  @ApiOperation({ summary: 'Get article by slug (public)' })
  @ApiResponse({ status: 200, description: 'Article detail' })
  @ApiResponse({ status: 404, description: 'Article tidak ditemukan' })
  async getArticleBySlug(@Param('slug') slug: string) {
    return this.publicService.getArticleBySlug(slug);
  }

  @Post('track-view')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track page view' })
  @ApiResponse({ status: 200, description: 'View tracked' })
  async trackPageView(
    @Body()
    body: {
      pagePath: string;
      pageType: PageType;
      articleId?: string;
    },
    @Req() req: Request,
  ) {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];

    return this.publicService.trackPageView(
      body.pagePath,
      body.pageType,
      body.articleId,
      ip,
      userAgent,
    );
  }

  @Post('articles/:id/feedback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record article feedback' })
  @ApiResponse({ status: 200, description: 'Feedback recorded' })
  async recordFeedback(
    @Param('id') articleId: string,
    @Body() body: { helpful: boolean },
  ) {
    return this.publicService.recordFeedback(articleId, body.helpful);
  }
}
