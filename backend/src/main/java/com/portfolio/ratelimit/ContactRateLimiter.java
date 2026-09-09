package com.portfolio.ratelimit;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

/**
 * Rate limiter simples em memória para o endpoint público de contato —
 * a única escrita não autenticada da API, e por isso a mais exposta a
 * abuso (spam, flood).
 *
 * <p><b>Limite:</b> {@value MAX_SUBMISSIONS_PER_WINDOW} envios por IP a
 * cada {@code WINDOW}, usando uma janela deslizante (sliding window).</p>
 *
 * <p><b>Limitação conhecida:</b> o estado é mantido em memória local da
 * instância. Isso é suficiente para uma única instância (o caso comum de
 * um portfolio pessoal), mas não é compartilhado entre réplicas em um
 * deploy horizontalmente escalado — nesse cenário, troque por um
 * contador centralizado (Redis, ex: Bucket4j com backend Redis).</p>
 */
@Component
public class ContactRateLimiter {

    private static final int MAX_SUBMISSIONS_PER_WINDOW = 5;
    private static final Duration WINDOW = Duration.ofMinutes(30);

    private final Map<String, ConcurrentLinkedDeque<Instant>> submissionsByIp = new ConcurrentHashMap<>();

    /**
     * @return {@code true} se a submissão for permitida (e já registrada);
     *         {@code false} se o IP estourou o limite na janela atual.
     */
    public boolean tryAcquire(String clientIp) {
        Instant now = Instant.now();
        ConcurrentLinkedDeque<Instant> timestamps =
                submissionsByIp.computeIfAbsent(clientIp, ip -> new ConcurrentLinkedDeque<>());

        synchronized (timestamps) {
            while (!timestamps.isEmpty() && Duration.between(timestamps.peekFirst(), now).compareTo(WINDOW) > 0) {
                timestamps.pollFirst();
            }

            if (timestamps.size() >= MAX_SUBMISSIONS_PER_WINDOW) {
                return false;
            }

            timestamps.addLast(now);
            return true;
        }
    }
}
