import { useQuery, useMutation } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => publicService.getCategories(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useArticlesByCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => publicService.getArticlesByCategory(slug),
    enabled: !!slug,
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => publicService.getArticleBySlug(slug),
    enabled: !!slug,
  });
}

export function useSearchArticles(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => publicService.searchArticles(query),
    enabled: query.length >= 2,
  });
}

export function usePopularArticles(limit = 5) {
  return useQuery({
    queryKey: ["popular-articles", limit],
    queryFn: () => publicService.getPopularArticles(limit),
  });
}

export function useRecentArticles(limit = 5) {
  return useQuery({
    queryKey: ["recent-articles", limit],
    queryFn: () => publicService.getRecentArticles(limit),
  });
}

export function useTrackPageView() {
  return useMutation({
    mutationFn: publicService.trackPageView,
  });
}

export function useRecordFeedback() {
  return useMutation({
    mutationFn: ({
      articleId,
      helpful,
    }: {
      articleId: string;
      helpful: boolean;
    }) => publicService.recordFeedback(articleId, helpful),
  });
}
